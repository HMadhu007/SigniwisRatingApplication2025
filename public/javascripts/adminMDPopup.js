function oRequestRatinsas(id){
    debugger
    //alert("Requesting Ratings for : " + id)

    fetch('/adminRateReqs', {
      method: 'POST',
  })
  .then(response => {
      if (response.ok) {
          alert('Data created successfully.');
      } else {
          alert('Error creating SQL Data.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred.');
  });
}