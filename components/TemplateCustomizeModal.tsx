'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Download, Loader, Eye } from 'lucide-react';

interface Template {
  id: string;
  type: string;
  category: string;
  name: string;
  description: string;
  template: string;
  endpoint: string;
  defaults?: Record<string, string>;
  questions?: Array<{
    key: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }>;
}

interface CustomizeModalProps {
  template: Template;
  onClose: () => void;
}

function hasValue(value: string) {
  return value.trim().length > 0;
}

function isUrlLike(value: string) {
  return (
    /^https?:\/\//i.test(value) ||
    value.startsWith('/') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  );
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function TemplateCustomizeModal({
  template,
  onClose,
}: CustomizeModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState('');
  const [renderOutput, setRenderOutput] = useState('');
  const [renderLoading, setRenderLoading] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [templateDetails, setTemplateDetails] = useState<Template>(template);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchTemplateDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://img-server-theta.vercel.app/api/tamplates/profile/${template.category}/${template.id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load template details (${response.status})`);
        }

        const data = await response.json();
        const details: Template =
          data && data.template && typeof data.template === 'object'
            ? data.template
            : data;

        if (cancelled) {
          return;
        }

        setTemplateDetails(details);
        setFormData(prev => {
          const next = { ...prev };

          for (const question of details.questions ?? []) {
            if (next[question.key] === undefined && details.defaults?.[question.key] !== undefined) {
              next[question.key] = details.defaults[question.key];
            }
          }

          return next;
        });
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to load template details'
          );
        }
        console.error('Failed to fetch template details:', fetchError);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTemplateDetails();

    return () => {
      cancelled = true;
    };
  }, [template.category, template.id]);

  const handleInputChange = (key: string, value: string) => {
    setError('');
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getPayload = () =>
    Object.fromEntries(
      Object.entries({
        ...(templateDetails.defaults ?? {}),
        ...formData,
      })
        .map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
        .filter(([, value]) => value !== '')
    ) as Record<string, string>;

  const getMissingRequiredFields = () =>
    (templateDetails.questions ?? []).filter(
      question => question.required && !hasValue(formData[question.key] ?? '')
    );

  const applyRenderResult = (result: unknown) => {
    if (typeof result === 'string') {
      const text = result.trim();
      const parsedJson = text.startsWith('{') || text.startsWith('[') ? safeJsonParse(text) : null;

      if (parsedJson) {
        applyRenderResult(parsedJson);
        return;
      }

      setRenderOutput(text);
      setPreviewUrl(isUrlLike(text) ? text : text.includes('<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(text)}` : '');
      return;
    }

    if (!result || typeof result !== 'object') {
      setRenderOutput(String(result ?? ''));
      setPreviewUrl('');
      return;
    }

    const payload = result as Record<string, unknown>;
    const previewCandidate = ['url', 'preview', 'image', 'svg', 'src']
      .map(key => payload[key])
      .find(value => typeof value === 'string' && hasValue(value));
    const outputCandidate = ['output', 'markdown', 'content', 'body', 'result', 'data']
      .map(key => payload[key])
      .find(value => typeof value === 'string' && hasValue(value));

    const textOutput =
      typeof outputCandidate === 'string'
        ? outputCandidate
        : JSON.stringify(payload, null, 2);

    setRenderOutput(textOutput);
    setPreviewUrl(
      typeof previewCandidate === 'string'
        ? isUrlLike(previewCandidate)
          ? previewCandidate
          : previewCandidate.includes('<svg')
            ? `data:image/svg+xml;utf8,${encodeURIComponent(previewCandidate)}`
            : ''
        : ''
    );

    if (!previewCandidate && textOutput.includes('<svg')) {
      setPreviewUrl(`data:image/svg+xml;utf8,${encodeURIComponent(textOutput)}`);
    }
  };

  const handleRender = async () => {
    if (!templateDetails.questions?.length) {
      setError('Template details are not available yet.');
      return;
    }

    const missing = getMissingRequiredFields();

    if (missing.length > 0) {
      setError(`Please fill required fields: ${missing.map(field => field.label).join(', ')}`);
      return;
    }

    setPreviewUrl('');
    setRenderOutput('');
    setShowLivePreview(false);
    setRenderLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/tamplates/profile/${template.category}/${template.id}/render`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(getPayload()),
        }
      );

      const contentType = response.headers.get('content-type') ?? '';

      if (!response.ok) {
        const errorBody = contentType.includes('application/json')
          ? JSON.stringify(await response.json(), null, 2)
          : await response.text();
        throw new Error(errorBody || `Render failed (${response.status})`);
      }

      if (contentType.includes('application/json')) {
        applyRenderResult(await response.json());
      } else {
        applyRenderResult(await response.text());
      }

      setShowLivePreview(true);
    } catch (renderError) {
      setError(
        renderError instanceof Error ? renderError.message : 'Failed to render template'
      );
      console.error('Failed to render template:', renderError);
    } finally {
      setRenderLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!templateDetails.questions?.length) {
      setError('Template details are not available yet.');
      return;
    }

    const missing = getMissingRequiredFields();

    if (missing.length > 0) {
      setError(`Please fill required fields: ${missing.map(field => field.label).join(', ')}`);
      return;
    }

    setError('');

    try {
      const response = await fetch(
        `/api/tamplates/profile/${template.category}/${template.id}/render?download=true`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(getPayload()),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? '';
        const errorBody = contentType.includes('application/json')
          ? JSON.stringify(await response.json(), null, 2)
          : await response.text();
        throw new Error(errorBody || `Download failed (${response.status})`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const fileNameFromHeader = response.headers
        .get('content-disposition')
        ?.match(/filename="?([^"]+)"?/i)?.[1];
      const fallbackExtension = blob.type.includes('svg') ? 'svg' : 'md';
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileNameFromHeader ?? `${template.id}-readme.${fallbackExtension}`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error ? downloadError.message : 'Failed to download'
      );
      console.error('Failed to download:', downloadError);
    }
  };

  const handleCopyMarkdown = async () => {
    const textToCopy = renderOutput || previewUrl;

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
        <div
          className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
                Customize: {template.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {template.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 border-b border-zinc-200 p-6 dark:border-zinc-800 lg:border-b-0 lg:border-r">
              <h3 className="mb-6 font-semibold text-zinc-950 dark:text-white">
                Template Details
              </h3>

              {error ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-zinc-500">Loading template details...</p>
                ) : templateDetails.questions && templateDetails.questions.length > 0 ? (
                  templateDetails.questions.map(question => (
                    <div key={question.key}>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {question.label}
                        {question.required && <span className="text-red-500">*</span>}
                      </label>

                      {question.type === 'textarea' ? (
                        <textarea
                          value={formData[question.key] || ''}
                          onChange={e => handleInputChange(question.key, e.target.value)}
                          placeholder={question.placeholder}
                          rows={3}
                          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                      ) : question.type === 'url' ? (
                        <input
                          type="url"
                          value={formData[question.key] || ''}
                          onChange={e => handleInputChange(question.key, e.target.value)}
                          placeholder={question.placeholder}
                          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                      ) : question.type === 'email' ? (
                        <input
                          type="email"
                          value={formData[question.key] || ''}
                          onChange={e => handleInputChange(question.key, e.target.value)}
                          placeholder={question.placeholder}
                          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[question.key] || ''}
                          onChange={e => handleInputChange(question.key, e.target.value)}
                          placeholder={question.placeholder}
                          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No template details available</p>
                )}
              </div>

              <button
                onClick={handleRender}
                disabled={renderLoading || loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-blue-500 dark:focus:ring-offset-zinc-900"
              >
                {renderLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-4 font-semibold text-zinc-950 dark:text-white">
                Live Preview
              </h3>

              {!showLivePreview ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Fill the form and click Preview to see the result
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-auto rounded-lg border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-black">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Template Preview"
                      className="w-full rounded"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                      {renderOutput || 'Preview will appear here'}
                    </pre>
                  )}
                </div>
              )}

              {renderOutput && renderOutput !== previewUrl ? (
                <div className="mt-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                    Generated Output
                  </div>
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                    {renderOutput}
                  </pre>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  disabled={!renderOutput && !previewUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-900"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={renderLoading || loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-green-500 dark:focus:ring-offset-zinc-900"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
