## Movietracker-backend 

A backend server written in NestJS to support the frontend movie/tvshow collection application. The server is responsible for communicating with the Radarr, Sonarr and a CouchDB database.

When a movie or TV show synchronises with a 'buffer' database, the backend server responds by calling Radarr or Sonarr API's. When succesful, the movie or TV show is placed in collection database and the entry is removed from the temporary buffer database. 
Both these databases synchronize with the frontend. As such no API calls are needed from the frontend.

The application has a controller to handle webhooks from Radarr and Sonarr. Whenever a movie or TV show is 'grabbed' (found online and send to a torrent client) or downloaded, Radarr or Sonarr can communicate this with a webhook. The backend server will respond appropriately and update the collection to give frontend users status feedback. Webhooks can also be used to notify Kodi with a notification. 
A cron job runs daily to keep databases (internally of Radarr and Sonarr) synchronized with the CouchDB collection database. Because 

The goal is to be able to use bother frontends and 







The server watches 

After successful requests to these API's, movies and TV shows are added to a collection in a CouchDB database, which in sync with the frontend. Whenever synchronisation happens, the backend will initiate logic to 


## Technical
Two collections are used for a movie and a TV show: a buffered collection and a full collection. When new items are added to the buffered collection, the appropiat
