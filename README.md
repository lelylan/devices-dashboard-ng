# AngularJS Dashboard for Lelylan

Lelylan Dashboard based on AngularJS working on mobile, tablet and desktop.
Check out the [demo](http://lelylan.github.io/devices-dashboard-ng/demo.html).


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.


### Setup

* Fork and clone the repository
* Run `npm install && bower install`

### With docker

#### Badges
Docker image: [lelylanlab/devices-dashboard-ng](https://hub.docker.com/r/lelylanlab/devices-dashboard-ng/)

[![](https://images.microbadger.com/badges/version/lelylanlab/devices-dashboard-ng:latest.svg)](http://microbadger.com/images/lelylanlab/devices-dashboard-ng:latest "Get your own version badge on microbadger.com")  [![](https://images.microbadger.com/badges/image/lelylanlab/devices-dashboard-ng:latest.svg)](http://microbadger.com/images/lelylanlab/devices-dashboard-ng:latest "Get your own image badge on microbadger.com")

### Use docker hub image
```bash
$ docker run -d -it --name devices-dashboard-ng lelylanlab/devices-dashboard-ng
```

### Generate local image
```bash
$ docker build --tag=devices-dashboard-ng .
$ docker run -d -it --name devices-dashboard-ng devices-dashboard-ng
```

### Generate local image
```bash
$ docker-compose build
$ docker-compose up -d
```

### Unit tests (karma)

* `grunt karma:unit`


### Creating your own distribution

* `grunt build`

The new distribution files will be created in the `dist/` folder.


### Coding guidelines

Follow [AngularJS](https://github.com/johnpapa/angular-styleguide) guidelines.


## Feedback

Use the [issue tracker](http://github.com/lelylan/devices-dashboard-ng/issues) for bugs or [stack overflow](http://stackoverflow.com/questions/tagged/lelylan) for questions.
[Mail](mailto:dev@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/devices-dashboard-ng)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Site](http://lelylan.com)


## Authors

[Andrea Reginato](https://www.linkedin.com/in/andreareginato)


## Contributors

Special thanks to all [contributors](https://github.com/lelylan/devices-dashboard-ng/contributors)
for submitting patches.

## Changelog

See [CHANGELOG](https://github.com/lelylan/devices-dashboard-ng/blob/master/CHANGELOG.md)


## License

Lelylan is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
