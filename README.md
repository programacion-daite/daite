Comando docker build platform amd64:
With cache:
```
docker build --platform linux/amd64 --load -t josetejada110/laravel_react_starter_kit:latest --push .
```
Without cache:
```
docker build --platform linux/amd64 --load -t josetejada110/laravel_react_starter_kit:latest --push --no-cache .
```
José Tejada
