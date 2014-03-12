module.exports = function(grunt) {
  
  // Load all avaiable tasks
  require("load-grunt-tasks")(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    karma: {
      unit: {
        configFile: "karma.conf.js"
      },
      
      ci: {
        configFile: "karma.conf.js",
        browsers: ["PhantomJS"],
        singleRun: true
      }
    }
    
  });

  // Default task(s).
  grunt.registerTask("default", "test");
  
  grunt.registerTask("test", ["karma:unit"]);

};