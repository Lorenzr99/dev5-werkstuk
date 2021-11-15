# Werkstuk Development V - Lorenz Reweghs
Deze Github repo bevat de API die ontwikkeld is voor de webapplicatie **Festivalwijzer**.<br>
De API zorgt voor de CRUD die nodig is om de gebruikers, de festivals en de comments te beheren.<br>
Deze rest-full API is verbonden met een [PostgreSQL](https://www.postgresql.org/) database en valt onder de [MIT license](https://opensource.org/licenses/MIT).

## Benodigde setup
1. git clone https://github.com/Lorenzr99/dev5-werkstuk
2. .env file aanmaken op basis van .env.template
3. docker-compose up --build
4. Om de testen uit te voeren: 
- cd .\api\
- npm test

Indien de API geen verbinding kan maken met de database,
volstaat het om nodemon in de API te triggeren nadat de database aangeeft dat deze connecties kan ontvangen.

## Docs
[Contributing guidelines](./CONTRIBUTING.md)<br>
[Code of conduct](./CODE_OF_CONDUCT.md)<br>
[MIT License](./LICENSE)<br>
<br>
In opdracht van [Eramushogeschool Brussel](https://www.erasmushogeschool.be/nl).