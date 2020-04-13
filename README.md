## Movietracker-backend 

A backend server written in the NestJS framework to support the frontend movie/tvshow collection application. The server is responsible for communicating with the Radarr, Sonarr and a remote CouchDB. 

Whenever a movie or TV show synchronises with a 'buffer' database, the backend server responds by calling Radarr or Sonarr API's. When successful, the movie or TV show is placed in a collection database and the entry is removed from the temporary buffer database. 
Both these databases synchronize with the frontend. This eliminates the nood for HTTP requests from the frontend to the backend.

This backend supports using Radarr and Sonarr frontends as well as a custom frontend built in ionic v4. For example, whenever a movie is added through the locally hosted Radarr frontend, the frontend in ionic is also updated. This functionality is achieved using a webhook integration in Radarr. The movie is grabbed (found online and sent to a downloading client), a webhook communicates this with the backend controller and the movie is added directly to the collection database. The same logic applies to Sonarr.

A movie or TV show can also be "monitored", monitored items will not download automatically but are added to the internal database of Radarr or Sonarr for later downloading.
Monitored Movies or TV shows do not have a webhook available as of this moment (I would like to implement this in a pull request of their Github). For the time being, a cron job runs daily that synchronizes Radarr/Sonarr databases to maintain monitored movies/TV shows.


## Technical
The backend is written in the NestJS framework. This is an Angular inspired node server. It uses Express under the hood. 
As in Angular, services are used to separate functionality. It is structured in a clear maintainable way. For example the movies controller communicates with the movies service which communicates with the Radarr service. 

Two collections are used for a movie and a TV show: a buffered collection and a full collection. When new items are added to the buffered collection, the appropriate calls are made to attempt to communicate with the corresponding API. On success, items are moved to a full collection and removed from the buffered collection.

## Installation
A startup script will be provided to add the IP address of the PouchDB server and other variables. 
For the downloading stack I would recommend a Docker Compose setup. An example compose file will be shared on release.


