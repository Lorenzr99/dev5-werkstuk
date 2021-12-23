# Werkstuk Development V - Lorenz Reweghs
Deze Github repo bevat de API die ontwikkeld is voor de webapplicatie **Festivalwijzer**.<br>
De API zorgt voor de CRUD die nodig is om de gebruikers, de festivals en de comments te beheren.<br>
Deze rest-full API is verbonden met een [PostgreSQL](https://www.postgresql.org/) database en valt onder de [MIT license](https://opensource.org/licenses/MIT).

## Benodigde setup
1. git clone https://github.com/Lorenzr99/dev5-werkstuk
2. .env file aanmaken op basis van .env.template
3. docker-compose up --build
4. Om de testen uit te voeren: "cd .\api\" en run vervolgens "npm test"

## Endpoints
- POST '/api/signup': registreert een gebruiker in de database
- POST '/api/login': login met een gekend emailadres en krijg een token terug
- GET '/api/festivals': returnt alle festivals in de database
- POST '/api/festivals': voegt een festival toe aan de database
- PUT '/api/festivals': wijzig een row in de festivals table
- DELETE '/api/festivals': verwijder een row in de festivals table
- GET '/api/requests': returnt alle requests in de database
- POST '/api/requests': voegt een aanvraag toe aan de database
- PUT '/api/requests': wijzig een row in de requests table
- DELETE '/api/requests': verwijder een row in de requests table

## Docs
[Contributing guidelines](./CONTRIBUTING.md)<br>
[Code of conduct](./CODE_OF_CONDUCT.md)<br>
[MIT License](./LICENSE)<br>
<br>
In opdracht van [Eramushogeschool Brussel](https://www.erasmushogeschool.be/nl).