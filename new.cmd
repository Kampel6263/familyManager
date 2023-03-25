@echo off
set /p type= "Create component or module?(c/m): "
if %type% == c (
    set /p name= "Input component name: "
) else (
    set /p name= "Input module name: "
)
npm run new%type% %name%
if %type% == c (
    echo Component '%name%' created successful
) else (
    echo Module '%name%' created successful
)
pause