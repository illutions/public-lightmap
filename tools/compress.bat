@echo off
setlocal EnableExtensions

set "HIGH_RESOLUTION=2048"
set "MED_RESOLUTION=1024"
set "LOW_RESOLUTION=128"

REM Usage: compress markers
REM Input:  markers.glb
REM Output: markers-high.glb, markers-med.glb, markers-low.glb

if "%~1"=="" (
  echo Usage: compress NAME
  echo Example for PowerShell: .\compress.bat markers
  exit /b 1
)

where gltf-transform >nul 2>&1
if errorlevel 1 (
  echo ERROR: gltf-transform was not found in PATH.
  exit /b 1
)

set "BASE=%~n1"
set "SOURCE=%~n1.glb"
pushd "%~dp0"

if not exist "%SOURCE%" (
  echo ERROR: "%SOURCE%" was not found next to compress.bat.
  popd
  exit /b 1
)

echo.
echo Creating HIGH: 100%% geometry, max. %HIGH_RESOLUTION% px textures, Draco compression...
call gltf-transform resize "%SOURCE%" "%BASE%-high-tex.glb" --width %HIGH_RESOLUTION% --height %HIGH_RESOLUTION%
if errorlevel 1 goto :error
call gltf-transform draco "%BASE%-high-tex.glb" "%BASE%-high.glb"
if errorlevel 1 goto :error

echo.
echo Creating MEDIUM: 50%% geometry, max. %MED_RESOLUTION% px textures, Draco compression...
call gltf-transform simplify "%SOURCE%" "%BASE%-med-tmp.glb" --ratio 0.5 --error 0.01
if errorlevel 1 goto :error
call gltf-transform resize "%BASE%-med-tmp.glb" "%BASE%-med-tex.glb" --width %MED_RESOLUTION% --height %MED_RESOLUTION%
if errorlevel 1 goto :error
call gltf-transform draco "%BASE%-med-tex.glb" "%BASE%-med.glb"
if errorlevel 1 goto :error

echo.
echo Creating LOW: 10%% geometry, max. %LOW_RESOLUTION% px textures, Draco compression...
call gltf-transform simplify "%SOURCE%" "%BASE%-low-tmp.glb" --ratio 0.1 --error 0.02
if errorlevel 1 goto :error
call gltf-transform resize "%BASE%-low-tmp.glb" "%BASE%-low-tex.glb" --width %LOW_RESOLUTION% --height %LOW_RESOLUTION%
if errorlevel 1 goto :error
call gltf-transform draco "%BASE%-low-tex.glb" "%BASE%-low.glb"
if errorlevel 1 goto :error

call :cleanup

echo.
echo Done:
echo   %BASE%-high.glb
echo   %BASE%-med.glb
echo   %BASE%-low.glb
popd
exit /b 0

:error
echo.
echo ERROR: Processing failed. Temporary files will be removed.
call :cleanup
popd
exit /b 1

:cleanup
del /q "%BASE%-high-tex.glb" 2>nul
del /q "%BASE%-med-tmp.glb" 2>nul
del /q "%BASE%-med-tex.glb" 2>nul
del /q "%BASE%-low-tmp.glb" 2>nul
del /q "%BASE%-low-tex.glb" 2>nul
exit /b 0




