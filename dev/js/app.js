// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
requirejs.config({
  baseUrl: "scripts",
  paths: {
    jquery: "lib/jquery-3.4.1.min"
  }
});

// Start loading the main app file
// application logic goes here
requirejs(["main"]);
