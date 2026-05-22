'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Loader } from 'lucide-react';
import TemplateCustomizeModal from './TemplateCustomizeModal';

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

type TemplateType = 'profile' | 'project' | 'company';

// Main Templates Page Component
export default function TemplatesBuilder() {
  const [templateType, setTemplateType] = useState<TemplateType | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);

  const templateTypes: { key: TemplateType; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'project', label: 'Project' },
    { key: 'company', label: 'Company' },
  ];

  useEffect(() => {
    if (templateType === 'profile') {
      fetchTemplates();
    }
  }, [templateType]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tamplates/profile');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Background gradient */}
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-96 w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.26),rgba(168,85,247,0.16)_35%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.32),rgba(217,70,239,0.18)_35%,transparent_70%)]" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Template Builder
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              Create Beautiful README Templates
            </h1>
            <p className="mt-4 text-lg leading-7 text-zinc-600 dark:text-zinc-400">
              Choose a template type, customize it with your information, and generate stunning README files or images instantly.
            </p>
          </div>
        </div>

        {!templateType ? (
          // Template Type Selection
          <div className="grid gap-6 sm:grid-cols-3">
            {templateTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setTemplateType(type.key)}
                className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-8 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition group-hover:opacity-100 dark:from-blue-500/20 dark:to-purple-500/20" />
                
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                    {type.label}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {type.key === 'profile' && 'Create stunning GitHub profile READMEs'}
                    {type.key === 'project' && 'Showcase your project beautifully'}
                    {type.key === 'company' && 'Professional company documentation'}
                  </p>
                </div>

                <div className="absolute bottom-0 right-0 h-px w-0 bg-gradient-to-l from-blue-500 transition group-hover:w-full" />
              </button>
            ))}
          </div>
        ) : (
          // Templates Grid
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={() => {
                    setTemplateType(null);
                    setTemplates([]);
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >
                  ← Back to categories
                </button>
                <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
                  {templateTypes.find(t => t.key === templateType)?.label} Templates
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="h-8 w-8 animate-spin text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading templates...</p>
                </div>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50"
                  >
                    {/* Template Image Placeholder */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto mb-2 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-500/20" />
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {template.category}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Template Info */}
                    <div className="p-6">
                      <h3 className="font-semibold text-zinc-950 dark:text-white">
                        {template.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {template.description}
                      </p>

                      {/* Customize Button */}
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowModal(true);
                        }}
                        className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-500 dark:focus:ring-offset-zinc-950"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-400">No templates available for this category.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Customize Modal */}
      {showModal && selectedTemplate && (
        <TemplateCustomizeModal
          template={selectedTemplate}
          onClose={() => {
            setShowModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </main>
  );
}
