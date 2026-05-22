@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo  TEMPLATE RENDER API - HTTP CONTRACT TESTS
echo ============================================================
echo.

set ENDPOINT=http://localhost:3102/api/templates/profile/developer/ocean/render

REM Test 1: Empty JSON object
echo TEST 1: Empty JSON object
echo POST %ENDPOINT%
echo Body: {}
echo.
curl -s -X POST "%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "{}" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

REM Test 2: Full payload
echo TEST 2: Full payload with all fields
echo POST %ENDPOINT%
echo.
curl -s -X POST "%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Developer\",\"email\":\"john@example.com\",\"bio\":\"Full-stack developer\",\"skills\":[\"TypeScript\",\"Node.js\",\"React\"],\"experience\":\"5 years\",\"projects\":[{\"name\":\"Alpha\",\"description\":\"Real-time tool\",\"link\":\"https://github.com/example/alpha\"}],\"social\":{\"github\":\"https://github.com/john\",\"linkedin\":\"https://linkedin.com/in/john\"},\"theme\":\"ocean\"}" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

REM Test 3: Minimal fields
echo TEST 3: Minimal fields (name + email)
echo POST %ENDPOINT%
echo Body: {"name":"Developer","email":"dev@example.com"}
echo.
curl -s -X POST "%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Developer\",\"email\":\"dev@example.com\"}" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

REM Test 4: Array body (wrong shape)
echo TEST 4: Array body (wrong JSON shape)
echo POST %ENDPOINT%
echo Body: ["developer","ocean","profile"]
echo.
curl -s -X POST "%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "[\"developer\",\"ocean\",\"profile\"]" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

REM Test 5: GET request
echo TEST 5: GET request (no body)
echo GET %ENDPOINT%
echo.
curl -s -X GET "%ENDPOINT%" ^
  -w "\nHTTP Status: %%{http_code}\n\n"

echo.
echo ============================================================
echo  END OF TESTS
echo ============================================================
