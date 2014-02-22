require('colors');

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


function handler(err, data) {
  for (var i = data.length - 1; i >= 0; i--) {
    var time = (((new Date().getTime())/1000) - data[i].Created)/60;
    
    if(time >= 6 && data[i].Status.indexOf('Exit') === -1) {
      var container = docker.getContainer(data[i].Id);
      container.stop(function(err, data) {
        console.log('Container stopped'.red);
      });
    }

    if(time >= 12 && data[i].Status.indexOf('Exit') !== -1) {
      var container = docker.getContainer(data[i].Id);
      container.remove(function(err, data) {
        console.log('Container removed'.red);
      });
    }

  }
}

docker.listContainers({all: 1}, handler);