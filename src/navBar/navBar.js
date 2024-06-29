document.addEventListener('DOMContentLoaded', function() {
    fetch('../navBar/navBar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navBar').innerHTML = data;
      });
  });
  // as of now not using this
  // I have out in the navigation br individually in each page
  // but if we have more pages we can use this directory to get navBar in all of these
  // with minimal code
  // Thanks for reading
  // Jitender Jangra