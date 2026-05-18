(() => {
const lastUpdated = '2026-05-13';
const dartsPlayers = {
            'Littler': {name: 'Luke Littler'},
            'Humphries': {name: 'Luke Humphries'},
            'Van Gerwen': {name: 'Michael van Gerwen'},
            'Rock': {name: 'Josh Rock'},
            'Clayton': {name: 'Jonny Clayton'},
            'Bunting': {name: 'Stephen Bunting'},
            'Price': {name: 'Gerwyn Price'},
            'Van Veen': {name: 'Gian van Veen'}
        };
const dartsSession = (time, label) => ({ time, label });
const plDartsStandings = [
            { pos: 1, name: 'Michael van Gerwen', played: 1, sf: 1, f: 1, w: 1, pts: 5 },
            { pos: 2, name: 'Gian van Veen', played: 1, sf: 1, f: 1, w: 0, pts: 3 },
            { pos: 3, name: 'Luke Humphries', played: 1, sf: 1, f: 0, w: 0, pts: 2 },
            { pos: 4, name: 'Jonny Clayton', played: 1, sf: 1, f: 0, w: 0, pts: 2 },
            { pos: 5, name: 'Luke Littler', played: 1, sf: 0, f: 0, w: 0, pts: 0 },
            { pos: 6, name: 'Stephen Bunting', played: 1, sf: 0, f: 0, w: 0, pts: 0 },
            { pos: 7, name: 'Josh Rock', played: 1, sf: 0, f: 0, w: 0, pts: 0 },
            { pos: 8, name: 'Gerwyn Price', played: 1, sf: 0, f: 0, w: 0, pts: 0 }
        ];
const dartsCalendar = [
            // Premier League Darts 2026 - Echte schema's met tijden
            { date: '2026-02-05', time: '20:00', event: 'Premier League Darts - Avond 1', location: 'Belfast', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Humphries', away: 'Van Veen'},
                {time: '20:40', home: 'Van Gerwen', away: 'Clayton'},
                {time: '21:10', home: 'Bunting', away: 'Rock'},
                {time: '21:40', home: 'Littler', away: 'Price'}
            ]},
            { date: '2026-02-12', time: '20:00', event: 'Premier League Darts - Avond 2', location: 'Cardiff', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Littler', away: 'Humphries'},
                {time: '20:40', home: 'Van Gerwen', away: 'Rock'},
                {time: '21:10', home: 'Clayton', away: 'Bunting'},
                {time: '21:40', home: 'Price', away: 'Van Veen'}
            ]},
            { date: '2026-02-19', time: '20:00', event: 'Premier League Darts - Avond 3', location: 'Liverpool', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Bunting', away: 'Van Veen'},
                {time: '20:40', home: 'Humphries', away: 'Rock'},
                {time: '21:10', home: 'Van Gerwen', away: 'Littler'},
                {time: '21:40', home: 'Clayton', away: 'Price'}
            ]},
            { date: '2026-02-26', time: '20:00', event: 'Premier League Darts - Avond 4', location: 'Manchester', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Littler', away: 'Clayton'},
                {time: '20:40', home: 'Bunting', away: 'Humphries'},
                {time: '21:10', home: 'Van Gerwen', away: 'Price'},
                {time: '21:40', home: 'Van Veen', away: 'Rock'}
            ]},
            { date: '2026-03-05', time: '20:00', event: 'Premier League Darts - Avond 5', location: 'Exeter', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Van Gerwen', away: 'Humphries'},
                {time: '20:40', home: 'Van Veen', away: 'Clayton'},
                {time: '21:10', home: 'Price', away: 'Bunting'},
                {time: '21:40', home: 'Littler', away: 'Rock'}
            ]},
            { date: '2026-03-12', time: '20:00', event: 'Premier League Darts - Avond 6', location: 'Rotterdam Ahoy', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Rock', away: 'Bunting'},
                {time: '20:40', home: 'Clayton', away: 'Van Gerwen'},
                {time: '21:10', home: 'Humphries', away: 'Van Veen'},
                {time: '21:40', home: 'Price', away: 'Littler'}
            ]},
            { date: '2026-03-19', time: '20:00', event: 'Premier League Darts - Avond 7', location: 'Newcastle', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Van Veen', away: 'Van Gerwen'},
                {time: '20:40', home: 'Bunting', away: 'Littler'},
                {time: '21:10', home: 'Rock', away: 'Price'},
                {time: '21:40', home: 'Clayton', away: 'Humphries'}
            ]},
            { date: '2026-03-26', time: '20:00', event: 'Premier League Darts - Avond 8', location: 'Sheffield', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'TBD', away: 'TBD'},
                {time: '20:40', home: 'TBD', away: 'TBD'},
                {time: '21:10', home: 'TBD', away: 'TBD'},
                {time: '21:40', home: 'TBD', away: 'TBD'}
            ]},
            { date: '2026-04-02', time: '20:00', event: 'Premier League Darts - Avond 9', location: 'Aberdeen', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Van Gerwen', away: 'Bunting'},
                {time: '20:40', home: 'Price', away: 'Humphries'},
                {time: '21:10', home: 'Van Veen', away: 'Littler'},
                {time: '21:40', home: 'Clayton', away: 'Rock'}
            ]},
            { date: '2026-04-09', time: '20:00', event: 'Premier League Darts - Avond 10', location: 'Dublin', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Humphries', away: 'Clayton'},
                {time: '20:40', home: 'Price', away: 'Rock'},
                {time: '21:10', home: 'Littler', away: 'Bunting'},
                {time: '21:40', home: 'Van Gerwen', away: 'Van Veen'}
            ]},
            { date: '2026-04-23', time: '20:00', event: 'Premier League Darts - Avond 11', location: 'Birmingham', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Van Veen', away: 'Price'},
                {time: '20:40', home: 'Bunting', away: 'Clayton'},
                {time: '21:10', home: 'Rock', away: 'Van Gerwen'},
                {time: '21:40', home: 'Humphries', away: 'Littler'}
            ]},
            { date: '2026-04-30', time: '20:00', event: 'Premier League Darts - Avond 13', location: 'Brighton', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Rock', away: 'Littler'},
                {time: '20:40', home: 'Bunting', away: 'Price'},
                {time: '21:10', home: 'Clayton', away: 'Van Veen'},
                {time: '21:40', home: 'Humphries', away: 'Van Gerwen'}
            ]},
            { date: '2026-05-07', time: '20:00', event: 'Premier League Darts - Avond 14', location: 'Glasgow', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Price', away: 'Clayton'},
                {time: '20:40', home: 'Littler', away: 'Van Gerwen'},
                {time: '21:10', home: 'Rock', away: 'Humphries'},
                {time: '21:40', home: 'Van Veen', away: 'Bunting'}
            ]},
            { date: '2026-05-14', time: '20:00', event: 'Premier League Darts - Avond 15', location: 'Nottingham', channel: 'Viaplay', matches: [
                {time: '20:10', home: 'Rock', away: 'Van Veen'},
                {time: '20:40', home: 'Price', away: 'Van Gerwen'},
                {time: '21:10', home: 'Humphries', away: 'Bunting'},
                {time: '21:40', home: 'Clayton', away: 'Littler'}
            ]},
            { date: '2026-05-21', time: '19:00', event: 'Premier League Darts - Play-Offs', location: 'London O2', channel: 'Viaplay', matches: [
                {time: '19:30', home: 'Halve Finale 1', away: ''},
                {time: '21:00', home: 'Halve Finale 2', away: ''},
                {time: '22:00', home: 'Finale', away: ''}
            ]},
            // Bahrain Darts Masters 2026
            { date: '2026-01-15', time: '18:00', event: 'Bahrain Darts Masters', location: 'Bahrain', channel: 'Viaplay', matches: [
                dartsSession('18:00', 'Kwartfinales')
            ]},
            { date: '2026-01-16', time: '18:00', event: 'Bahrain Darts Masters - Finale', location: 'Bahrain', channel: 'Viaplay', matches: [
                dartsSession('18:00', 'Halve finales + finale')
            ]},
            // Saudi Arabia Darts Masters 2026
            { date: '2026-01-19', time: '18:00', event: 'Saudi Arabia Darts Masters', location: 'Riyadh', channel: 'Viaplay', matches: [
                dartsSession('18:00', 'Kwartfinales')
            ]},
            { date: '2026-01-20', time: '18:00', event: 'Saudi Arabia Darts Masters - Finale', location: 'Riyadh', channel: 'Viaplay', matches: [
                dartsSession('18:00', 'Halve finales + finale')
            ]},
            // Winmau World Masters 2026
            { date: '2026-01-28', time: '13:00', event: 'Winmau World Masters', location: 'Milton Keynes', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Openingsdag')
            ]},
            { date: '2026-01-29', time: '13:00', event: 'Winmau World Masters', location: 'Milton Keynes', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Vervolg hoofdschema')
            ]},
            { date: '2026-01-30', time: '13:00', event: 'Winmau World Masters', location: 'Milton Keynes', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Laatste 32 / Laatste 16')
            ]},
            { date: '2026-01-31', time: '13:00', event: 'Winmau World Masters', location: 'Milton Keynes', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Kwartfinaledag')
            ]},
            { date: '2026-02-01', time: '19:00', event: 'Winmau World Masters - Finale', location: 'Milton Keynes', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // UK Open 2026
            { date: '2026-03-06', time: '13:00', event: 'UK Open', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Ronde 1 t/m 3'),
                dartsSession('19:00', 'Avondsessie - Ronde 4')
            ]},
            { date: '2026-03-07', time: '13:00', event: 'UK Open', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Ronde 5'),
                dartsSession('19:00', 'Avondsessie - Ronde 6 / kwartfinales')
            ]},
            { date: '2026-03-08', time: '13:00', event: 'UK Open - Finale', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Halve finales'),
                dartsSession('19:00', 'Avondsessie - Finale')
            ]},
            // European Tour 1 - Poland Darts Open 2026
            { date: '2026-02-20', time: '13:00', event: 'Poland Darts Open', location: 'Krakow', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-02-21', time: '13:00', event: 'Poland Darts Open', location: 'Krakow', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-02-22', time: '13:00', event: 'Poland Darts Open - Finale', location: 'Krakow', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 2 - European Darts Trophy 2026
            { date: '2026-03-13', time: '13:00', event: 'European Darts Trophy', location: 'Göttingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-03-14', time: '13:00', event: 'European Darts Trophy', location: 'Göttingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-03-15', time: '13:00', event: 'European Darts Trophy - Finale', location: 'Göttingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 3 - Belgian Darts Open 2026
            { date: '2026-03-20', time: '13:00', event: 'Belgian Darts Open', location: 'Wieze', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-03-21', time: '13:00', event: 'Belgian Darts Open', location: 'Wieze', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-03-22', time: '13:00', event: 'Belgian Darts Open - Finale', location: 'Wieze', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 4 - German Darts Grand Prix 2026
            { date: '2026-04-04', time: '13:00', event: 'German Darts Grand Prix', location: 'Munchen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-04-05', time: '13:00', event: 'German Darts Grand Prix', location: 'Munchen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-04-06', time: '13:00', event: 'German Darts Grand Prix - Finale', location: 'Munchen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 5 - European Darts Grand Prix 2026
            { date: '2026-04-17', time: '13:00', event: 'European Darts Grand Prix', location: 'Sindelfingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-04-18', time: '13:00', event: 'European Darts Grand Prix', location: 'Sindelfingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-04-19', time: '13:00', event: 'European Darts Grand Prix - Finale', location: 'Sindelfingen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 6 - Austrian Darts Open 2026
            { date: '2026-05-08', time: '13:00', event: 'Austrian Darts Open', location: 'Graz', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-05-09', time: '13:00', event: 'Austrian Darts Open', location: 'Graz', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-05-10', time: '13:00', event: 'Austrian Darts Open - Finale', location: 'Graz', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 7 - International Darts Open 2026
            { date: '2026-05-22', time: '13:00', event: 'International Darts Open', location: 'Riesa', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-05-23', time: '13:00', event: 'International Darts Open', location: 'Riesa', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-05-24', time: '13:00', event: 'International Darts Open - Finale', location: 'Riesa', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 8 - Baltic Sea Darts Open 2026
            { date: '2026-05-29', time: '13:00', event: 'Baltic Sea Darts Open', location: 'Kiel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-05-30', time: '13:00', event: 'Baltic Sea Darts Open', location: 'Kiel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-05-31', time: '13:00', event: 'Baltic Sea Darts Open - Finale', location: 'Kiel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // Nordic Darts Masters 2026
            { date: '2026-06-05', time: '19:00', event: 'Nordic Darts Masters', location: 'Copenhagen', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-06-06', time: '19:00', event: 'Nordic Darts Masters - Finale', location: 'Copenhagen', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // World Cup of Darts 2026
            { date: '2026-06-11', time: '13:00', event: 'World Cup of Darts', location: 'Frankfurt', channel: 'RTL7', matches: [
                dartsSession('13:00', 'Groepsfase')
            ]},
            { date: '2026-06-12', time: '13:00', event: 'World Cup of Darts', location: 'Frankfurt', channel: 'RTL7', matches: [
                dartsSession('13:00', 'Groepsfase / laatste 16')
            ]},
            { date: '2026-06-13', time: '19:00', event: 'World Cup of Darts', location: 'Frankfurt', channel: 'RTL7', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-06-14', time: '19:00', event: 'World Cup of Darts - Finale', location: 'Frankfurt', channel: 'RTL7', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // US Darts Masters 2026
            { date: '2026-06-26', time: '02:00', event: 'US Darts Masters', location: 'New York', channel: 'Viaplay', matches: [
                dartsSession('02:00', 'Kwartfinales')
            ]},
            { date: '2026-06-27', time: '02:00', event: 'US Darts Masters - Finale', location: 'New York', channel: 'Viaplay', matches: [
                dartsSession('02:00', 'Halve finales + finale')
            ]},
            // European Tour 9 - Slovak Darts Open 2026
            { date: '2026-06-19', time: '13:00', event: 'Slovak Darts Open', location: 'Bratislava', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-06-20', time: '13:00', event: 'Slovak Darts Open', location: 'Bratislava', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-06-21', time: '13:00', event: 'Slovak Darts Open - Finale', location: 'Bratislava', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 10 - European Darts Open 2026
            { date: '2026-07-10', time: '13:00', event: 'European Darts Open', location: 'Leverkusen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-07-11', time: '13:00', event: 'European Darts Open', location: 'Leverkusen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-07-12', time: '13:00', event: 'European Darts Open - Finale', location: 'Leverkusen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // World Matchplay 2026
            { date: '2026-07-18', time: '13:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-07-19', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-07-20', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-07-21', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-07-22', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-07-23', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-07-24', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-07-25', time: '19:00', event: 'World Matchplay', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales')
            ]},
            { date: '2026-07-26', time: '19:00', event: 'World Matchplay - Finale', location: 'Blackpool', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Finale')
            ]},
            // New Zealand Darts Masters 2026
            { date: '2026-08-14', time: '08:00', event: 'New Zealand Darts Masters', location: 'Hamilton', channel: 'Viaplay', matches: [
                dartsSession('08:00', 'Kwartfinales')
            ]},
            { date: '2026-08-15', time: '08:00', event: 'New Zealand Darts Masters - Finale', location: 'Hamilton', channel: 'Viaplay', matches: [
                dartsSession('08:00', 'Halve finales + finale')
            ]},
            // Australian Darts Masters 2026
            { date: '2026-08-21', time: '10:00', event: 'Australian Darts Masters', location: 'Wollongong', channel: 'Viaplay', matches: [
                dartsSession('10:00', 'Kwartfinales')
            ]},
            { date: '2026-08-22', time: '10:00', event: 'Australian Darts Masters - Finale', location: 'Wollongong', channel: 'Viaplay', matches: [
                dartsSession('10:00', 'Halve finales + finale')
            ]},
            // European Tour 11 - Hungarian Darts Trophy 2026
            { date: '2026-08-28', time: '13:00', event: 'Hungarian Darts Trophy', location: 'Budapest', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-08-29', time: '13:00', event: 'Hungarian Darts Trophy', location: 'Budapest', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-08-30', time: '13:00', event: 'Hungarian Darts Trophy - Finale', location: 'Budapest', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 12 - Czech Darts Open 2026
            { date: '2026-09-04', time: '13:00', event: 'Czech Darts Open', location: 'Praag', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-09-05', time: '13:00', event: 'Czech Darts Open', location: 'Praag', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-09-06', time: '13:00', event: 'Czech Darts Open - Finale', location: 'Praag', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 13 - Flanders Darts Trophy 2026
            { date: '2026-09-11', time: '13:00', event: 'Flanders Darts Trophy', location: 'Antwerpen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-09-12', time: '13:00', event: 'Flanders Darts Trophy', location: 'Antwerpen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-09-13', time: '13:00', event: 'Flanders Darts Trophy - Finale', location: 'Antwerpen', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // World Series Finals 2026
            { date: '2026-09-17', time: '19:00', event: 'World Series Finals', location: 'Amsterdam', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Openingsronde')
            ]},
            { date: '2026-09-18', time: '19:00', event: 'World Series Finals', location: 'Amsterdam', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Laatste 16')
            ]},
            { date: '2026-09-19', time: '19:00', event: 'World Series Finals', location: 'Amsterdam', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-09-20', time: '19:00', event: 'World Series Finals - Finale', location: 'Amsterdam', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // European Tour 14 - Swiss Darts Trophy 2026
            { date: '2026-10-09', time: '13:00', event: 'Swiss Darts Trophy', location: 'Basel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-10-10', time: '13:00', event: 'Swiss Darts Trophy', location: 'Basel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-10-11', time: '13:00', event: 'Swiss Darts Trophy - Finale', location: 'Basel', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // European Tour 15 - Dutch Darts Championship 2026
            { date: '2026-10-16', time: '13:00', event: 'Dutch Darts Championship', location: 'Maastricht', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-10-17', time: '13:00', event: 'Dutch Darts Championship', location: 'Maastricht', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-10-18', time: '13:00', event: 'Dutch Darts Championship - Finale', location: 'Maastricht', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Laatste 16'),
                dartsSession('19:00', 'Avondsessie - Kwartfinales / halve finales / finale')
            ]},
            // World Grand Prix 2026
            { date: '2026-09-28', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Eerste ronde')
            ]},
            { date: '2026-09-29', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Eerste ronde')
            ]},
            { date: '2026-09-30', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Eerste ronde')
            ]},
            { date: '2026-10-01', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Tweede ronde')
            ]},
            { date: '2026-10-02', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-10-03', time: '19:00', event: 'World Grand Prix', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales')
            ]},
            { date: '2026-10-04', time: '19:00', event: 'World Grand Prix - Finale', location: 'Leicester', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Finale')
            ]},
            // European Championship 2026
            { date: '2026-10-22', time: '19:00', event: 'European Championship', location: 'Dortmund', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Openingsronde')
            ]},
            { date: '2026-10-23', time: '19:00', event: 'European Championship', location: 'Dortmund', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Laatste 16')
            ]},
            { date: '2026-10-24', time: '19:00', event: 'European Championship', location: 'Dortmund', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-10-25', time: '19:00', event: 'European Championship - Finale', location: 'Dortmund', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // Grand Slam of Darts 2026
            { date: '2026-11-14', time: '13:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Groepsfase - Sessie 1'),
                dartsSession('19:00', 'Groepsfase - Sessie 2')
            ]},
            { date: '2026-11-15', time: '13:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Groepsfase - Sessie 3'),
                dartsSession('19:00', 'Groepsfase - Sessie 4')
            ]},
            { date: '2026-11-16', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Groepsfase')
            ]},
            { date: '2026-11-17', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Groepsfase')
            ]},
            { date: '2026-11-18', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Groepsfase')
            ]},
            { date: '2026-11-19', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Laatste 16')
            ]},
            { date: '2026-11-20', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Laatste 16')
            ]},
            { date: '2026-11-21', time: '19:00', event: 'Grand Slam of Darts', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Kwartfinales')
            ]},
            { date: '2026-11-22', time: '19:00', event: 'Grand Slam of Darts - Finale', location: 'Wolverhampton', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // Players Championship Finals 2026
            { date: '2026-11-27', time: '13:00', event: 'Players Championship Finals', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Openingsdag')
            ]},
            { date: '2026-11-28', time: '13:00', event: 'Players Championship Finals', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Laatste 16 / kwartfinales')
            ]},
            { date: '2026-11-29', time: '19:00', event: 'Players Championship Finals - Finale', location: 'Minehead', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Halve finales + finale')
            ]},
            // World Championship 2026/2027
            { date: '2026-12-15', time: '19:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Openingsavond - Eerste ronde')
            ]},
            { date: '2026-12-16', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-12-17', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste ronde'),
                dartsSession('19:00', 'Avondsessie - Eerste ronde')
            ]},
            { date: '2026-12-18', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Eerste / tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-12-19', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-12-20', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-12-21', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Middagsessie - Tweede ronde'),
                dartsSession('19:00', 'Avondsessie - Tweede ronde')
            ]},
            { date: '2026-12-22', time: '19:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('19:00', 'Tweede ronde')
            ]},
            { date: '2026-12-27', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Derde ronde'),
                dartsSession('19:00', 'Derde ronde')
            ]},
            { date: '2026-12-28', time: '13:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Derde ronde'),
                dartsSession('19:00', 'Derde ronde')
            ]},
            { date: '2026-12-29', time: '19:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Vierde ronde'),
                dartsSession('19:00', 'Vierde ronde')
            ]},
            { date: '2026-12-30', time: '19:00', event: 'World Championship', location: 'Alexandra Palace', channel: 'Viaplay', matches: [
                dartsSession('13:00', 'Vierde ronde'),
                dartsSession('19:00', 'Vierde ronde')
            ]},        ];
const officialPlayers = [
    { id: '40676', slug: 'luke-littler', name: 'Luke Littler', nickname: 'The Nuke', ranking: 1, countryCode: 'GB-ENG', homeTown: 'Warrington', darts: 'Target', walkOn: 'Green Light - Pitbull', leftHanded: false, prizeMoney: 4148925 },
    { id: '32102', slug: 'luke-humphries', name: 'Luke Humphries', nickname: 'Cool Hand', ranking: 2, countryCode: 'GB-ENG', homeTown: 'Crewe', darts: 'Red Dragon', walkOn: 'I Predict A Riot - Kaiser Chiefs', leftHanded: false, prizeMoney: 3978975 },
    { id: '33091', slug: 'gian-van-veen', name: 'Gian van Veen', nickname: 'The Giant', ranking: 3, countryCode: 'NL', homeTown: 'Poederoijen', darts: 'Red Dragon', walkOn: 'Astronomia - Tony Igy & Vicetone', leftHanded: false, prizeMoney: 1250450 },
    { id: '19', slug: 'michael-van-gerwen', name: 'Michael van Gerwen', nickname: 'Mighty Mike', ranking: 4, countryCode: 'NL', homeTown: 'Vlijmen', darts: 'Winmau', walkOn: 'Seven Nation Army - White Stripes', leftHanded: false, prizeMoney: 12225465 },
    { id: '30859', slug: 'jonny-clayton', name: 'Jonny Clayton', nickname: 'The Ferret', ranking: 5, countryCode: 'GB-WLS', homeTown: 'Pontyberem', darts: 'Red Dragon', walkOn: 'Johnny B Goode - Chuck Berry', leftHanded: false, prizeMoney: 3058250 },
    { id: '22', slug: 'james-wade', name: 'James Wade', nickname: 'The Machine', ranking: 6, countryCode: 'GB-ENG', homeTown: 'Aldershot', darts: 'Unicorn', walkOn: "I'm Still Standing - Elton John", leftHanded: true, prizeMoney: 5286482 },
    { id: '38552', slug: 'josh-rock', name: 'Josh Rock', nickname: 'Rocky', ranking: 7, countryCode: 'GB-NIR', homeTown: 'Broughshane', darts: 'Target', walkOn: 'Welcome to the Party - DJ Krissy', leftHanded: false, prizeMoney: 1150250 },
    { id: '11788', slug: 'gerwyn-price', name: 'Gerwyn Price', nickname: 'The Iceman', ranking: 8, countryCode: 'GB-WLS', homeTown: 'Markham', darts: 'Red Dragon', walkOn: 'Ice Ice Baby - MC Hammer', leftHanded: false, prizeMoney: 5052000 },
    { id: '876', slug: 'stephen-bunting', name: 'Stephen Bunting', nickname: 'The Bullet', ranking: 9, countryCode: 'GB-ENG', homeTown: 'St Helens', darts: 'Target', walkOn: 'Titanium - David Guetta', leftHanded: false, prizeMoney: 2363750 },
    { id: '31356', slug: 'danny-noppert', name: 'Danny Noppert', nickname: 'The Freeze', ranking: 10, countryCode: 'NL', homeTown: 'Joure', darts: 'Winmau', walkOn: 'High Hopes - Panic! At The Disco', leftHanded: false, prizeMoney: 1827000 },
    { id: '4', slug: 'gary-anderson', name: 'Gary Anderson', nickname: 'Flying Scotsman', ranking: 11, countryCode: 'GB-SCT', homeTown: 'Burnham-on-Sea', darts: 'Unicorn', walkOn: 'Jump Around - House of Pain', leftHanded: false, prizeMoney: 5642278 },
    { id: '11843', slug: 'chris-dobey', name: 'Chris Dobey', nickname: 'Hollywood', ranking: 12, countryCode: 'GB-ENG', homeTown: 'Bedlington', darts: 'Target', walkOn: 'Hey Jude - The Beatles', leftHanded: false, prizeMoney: 1872750 },
    { id: '32037', slug: 'ryan-searle', name: 'Ryan Searle', nickname: 'Heavy Metal', ranking: 13, countryCode: 'GB-ENG', homeTown: 'Westleigh', darts: 'Harrows', walkOn: 'Paranoid - Black Sabbath', leftHanded: false, prizeMoney: 1436350 },
    { id: '11821', slug: 'nathan-aspinall', name: 'Nathan Aspinall', nickname: 'The Asp', ranking: 14, countryCode: 'GB-ENG', homeTown: 'Stockport', darts: 'Target', walkOn: 'Mr Brightside - The Killers', leftHanded: false, prizeMoney: 2692925 },
    { id: '754', slug: 'ross-smith', name: 'Ross Smith', nickname: 'Smudger', ranking: 15, countryCode: 'GB-ENG', homeTown: 'Dover', darts: 'Unicorn', walkOn: 'Red Light Spells Danger - Billy Ocean', leftHanded: false, prizeMoney: 1267120 },
    { id: '32956', slug: 'wessel-nijman', name: 'Wessel Nijman', nickname: '', ranking: 16, countryCode: 'NL', homeTown: 'Uitgeest', darts: 'Mission Signature', walkOn: "Summer of '69 - Bryan Adams", leftHanded: false, prizeMoney: 584400 },
    { id: '30844', slug: 'jermaine-wattimena', name: 'Jermaine Wattimena', nickname: 'The Machine Gun', ranking: 17, countryCode: 'NL', homeTown: 'Westervoort', darts: 'Bulls', walkOn: 'Bella Ciao - Hardwell', leftHanded: false, prizeMoney: 1121250 },
    { id: '11902', slug: 'martin-schindler', name: 'Martin Schindler', nickname: 'The Wall', ranking: 18, countryCode: 'DE', homeTown: 'Strausberg', darts: "Bull's", walkOn: 'In the End - Linkin Park', leftHanded: false, prizeMoney: 1134750 },
    { id: '11804', slug: 'luke-woodhouse', name: 'Luke Woodhouse', nickname: 'Woody', ranking: 19, countryCode: 'GB-ENG', homeTown: 'Bewdley', darts: 'Harrows', walkOn: "C'est La Vie - Stereophonics", leftHanded: false, prizeMoney: 770075 },
    { id: '30829', slug: 'mike-de-decker', name: 'Mike De Decker', nickname: 'Real Deal', ranking: 20, countryCode: 'BE', homeTown: 'Mechelen', darts: 'Mission', walkOn: 'Three Little Birds - Bob Marley', leftHanded: false, prizeMoney: 781000 },
    { id: '36314', slug: 'damon-heta', name: 'Damon Heta', nickname: 'The Heat', ranking: 21, countryCode: 'AU', homeTown: 'Perth, Western Australia', darts: 'Harrows', walkOn: 'Dancing In The Dark - Bruce Springsteen', leftHanded: false, prizeMoney: 1443500 },
    { id: '224', slug: 'krzysztof-ratajski', name: 'Krzysztof Ratajski', nickname: 'The Polish Eagle', ranking: 22, countryCode: 'PL', homeTown: 'Warszawa', darts: 'Bulls', walkOn: 'Whatever You Want - Status Quo', leftHanded: false, prizeMoney: 1455900 },
    { id: '31041', slug: 'rob-cross', name: 'Rob Cross', nickname: 'Voltage', ranking: 23, countryCode: 'GB-ENG', homeTown: 'Hastings', darts: 'Target', walkOn: "I Don't Wanna Wait - David Guetta & One Republic", leftHanded: false, prizeMoney: 3535450 },
    { id: '2554', slug: 'daryl-gurney', name: 'Daryl Gurney', nickname: 'Superchin', ranking: 24, countryCode: 'GB-NIR', homeTown: 'Tyrone', darts: 'Winmau', walkOn: 'Sweet Caroline - Neil Diamond', leftHanded: false, prizeMoney: 2371150 }
];
const sourceMeta = {
    players: {
        label: 'PDC participants endpoint',
        url: 'https://participants.darts.web.gc.pdcservices.co.uk/v2/?page.size=50',
        snapshotDate: '2026-05-13'
    },
    calendar: {
        label: 'Onafhankelijke dartskalender in deze app',
        snapshotDate: '2026-05-13'
    },
    planner: {
        label: 'Persoonlijke board-, kanaal- en kijknotities',
        snapshotDate: '2026-05-13'
    }
};
window.DARTS_DATA = { lastUpdated, dartsPlayers, plDartsStandings, dartsCalendar, officialPlayers, sourceMeta };
})();
