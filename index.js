// 1. updates the page after DOMcontentLoaded
// 2. addsEvent listener to the buyTicket button
// 3. when clicked, the button calls function to update tickets sold in the server
// 4. the function checks on whether to update or not depending on ticketsSold
// 5. if ticketsSold===capacity, the function invokes another function; nextFilm
// 6.

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  let remainingTickets;
  let ticketsSold;
  let capacity;
  let data;
  let currentFilmID = 1; //initializes ID of the current film delt with
  let numberOfClicks = 0;

  //create a nextFilm Button and append it
  const buyTicket = document.getElementById("buy-ticket");
  const nextFilm = document.createElement("button", {
    id: "nextFilm",
  });
  nextFilm.textContent = "Next Film";
  let card = document.getElementsByClassName("card");
  card[0].appendChild(nextFilm);

  displayNextFilm(); //function to facilitate the next film button

  displayAvailableTitles(); //function to facilitate the display of available tickets

  function displayNextFilm() {
    //update the page with a new film details, delete the one displaying after decrementing the remaining tickets to zero;
    nextFilm.addEventListener("click", () => {
      //alert user that he has selected that film
      const p = document.getElementById("selectedP");
      p.textContent = "You've selected..."; //change from "best Selling" to "you selected"
      p.classList.add("p");

      //make a new GET request
      let xhrFilmNext = new XMLHttpRequest();

      // Define the URL of the API endpoint
      currentFilmID++;
      const urlFilmNext = "http://localhost:3000/films/" + currentFilmID;
      // Open the request
      xhrFilmNext.open("GET", urlFilmNext, true);

      // Send the request
      xhrFilmNext.send();

      //next film's data
      xhrFilmNext.onload = function () {
        data = JSON.parse(xhrFilmNext.responseText);

        // Display the next film's details
        const poster = document.getElementById("poster");
        poster.src = data.poster;

        const title = document.getElementById("title");
        title.textContent = data.title;

        const runtime = document.getElementById("runtime");
        runtime.textContent = `${data.runtime} minutes`;

        const showtime = document.getElementById("showtime");
        showtime.textContent = data.showtime;

        const filmInfo = document.getElementById("film-info");
        filmInfo.textContent = data["description"];

        capacity = data["capacity"];

        ticketsSold = data["tickets_sold"];

        remainingTickets = capacity - ticketsSold;
        const ticketNum = document.getElementById("ticket-num");
        ticketNum.textContent = remainingTickets;

        if (capacity === ticketsSold) {
          buyTicket.disabled = true;
          buyTicket.textContent = "Sold Out!";
        } else {
          buyTicket.disabled = false;
          buyTicket.textContent = "Buy Ticket";
        }

        console.log(
          `${data} is the data, film id is ${currentFilmID}remaining tickets is ${remainingTickets}, ticketsSold and capacity is ${
            (ticketsSold, capacity)
          }`
        );

        return data, remainingTickets, ticketsSold, capacity;
      };
    });
  }
  currentFilmID;
  remainingTickets;
  ticketsSold;
  capacity;

  // Create an XMLHttpRequest object
  const xhr1 = new XMLHttpRequest();

  // Define the URL of the API endpoint
  const urlFilm1 = "http://localhost:3000/films/1";

  // Open the request
  xhr1.open("GET", urlFilm1, true);

  // Send the request
  xhr1.send();

  // Handle the response
  xhr1.onload = function () {
    // The request was successful, parse the JSON response
    data = JSON.parse(xhr1.responseText);

    //declaring all the variables
    remainingTickets = data["capacity"] - data["tickets_sold"]; //declare rem tickets
    const ticketNum = document.getElementById("ticket-num"); //ticket number
    ticketsSold = data["tickets_sold"]; //declare ticketsSold
    capacity = data["capacity"]; //declare capacity

    // Display the film details
    const poster = document.getElementById("poster");
    poster.src = data.poster;

    const title = document.getElementById("title");
    title.textContent = data.title;

    const runtime = document.getElementById("runtime");
    runtime.textContent = `${data.runtime} minutes`;

    const showtime = document.getElementById("showtime");
    showtime.textContent = data.showtime;

    const filmInfo = document.getElementById("film-info");
    filmInfo.textContent = data["description"];

    ticketNum.textContent = remainingTickets;

    // Add an event listener to the buy ticket button
    const buyTicket = document.getElementById("buy-ticket");
    buyTicket.addEventListener("click", () => {
      let mostBoughtFilmInvoked = false; // Declare a flag to track if mostBoughtFilm() has been invoked

      //define a function to updateTicketsSoldInServer in our server too

      alert(`You've Succcesfully Purchased the ${data.title} Ticket!`);

      updateTicketsSoldInServer();

      const ticketNum = document.getElementById("ticket-num");
      ticketNum.textContent = remainingTickets;

      function updateTicketsSoldInServer() {
        /* this condition first checks whether the tickets Sold = capacity of the being clicked video
        before it sents a request to update on the server */

        currentFilmID = data.id;

        if (ticketsSold === capacity) {
          //Tickets sold out. Cannot update, so return nothing

          return;
        } else {
          //feedback message to the user that he/she has baught a ticket
          numberOfClicks++;
          const feedback = document.getElementById("feedback");
          feedback.textContent = `you've now bought ${numberOfClicks} ticket for this film`;

          //update our server by incrementing ticketsSold;
          ticketsSold++;
          remainingTickets--;
          console.log("i am running the else block");

          //1. set Url, 2. make request, 3. open, 4. setRequestHeader, 5. onload 6. send
          let xhr = new XMLHttpRequest();
          const xhrURl = `http://localhost:3000/films/${currentFilmID}`;
          xhr.open("PATCH", xhrURl, true);
          xhr.setRequestHeader("Content-Type", "application/json");

          xhr.onload = function () {
            console.log("done");
            //confirm if everything is okay

            if (xhr.readyState === xhr.DONE) {
              if (xhr.status === 200) {
                console.log("okay");
              } else {
                console.log("Error updating film: " + xhr.status);
              }
            }
          };

          xhr.send(JSON.stringify({ tickets_sold: ticketsSold }));
        }
        // Display the film details
        const xhrDisplayThisFilm = XMLHttpRequest();

        const xhrDisplayThisFilmURL = `http://localhost:3000/films/${currentFilmID}`;
        xhrDisplayThisFilm.open("GET", xhrDisplayThisFilmURL, true);
        xhrDisplayThisFilm.send();
        debugger;

        xhrDisplayThisFilm.onload = function () {
          data = JSON.parse(xhrDisplayThisFilm.responseText);
          //populate the card with the same data

          console.log(data);
          console.log("yes, what you are looking for");

          const poster = document.getElementById("poster");
          poster.src = data.poster;

          const title = document.getElementById("title");
          title.textContent = data.title;

          const runtime = document.getElementById("runtime");
          runtime.textContent = `${data.runtime} minutes`;

          const showtime = document.getElementById("showtime");
          showtime.textContent = data.showtime;

          const filmInfo = document.getElementById("film-info");
          filmInfo.textContent = data["description"];

          capacity = data["capacity"];

          ticketsSold = data["tickets_sold"];

          remainingTickets = capacity - ticketsSold;
          const ticketNum = document.getElementById("ticket-num");
          ticketNum.textContent = remainingTickets;

          currentFilmID = dataId;

          ticketNum.textContent = remainingTickets;
        };
      }
      // Check if mostBoughtFilm() has not been invoked yet
      if (!mostBoughtFilmInvoked) {
        // Invoke the mostBoughtFilm() function
        mostBoughtFilm();
        mostBoughtFilmInvoked = true; // Set the flag to true to prevent subsequent invocations
      }
    });
  };

  function displayAvailableTitles() {
    // Create an XMLHttpRequest object to fetch films and make films list
    const xhrFilms = new XMLHttpRequest();

    // Define the URL of the API endpoint

    const urlFilms = "http://localhost:3000/films";

    // Open the request
    xhrFilms.open("GET", urlFilms, true);

    // Send the request
    xhrFilms.send();

    // Handle the response
    xhrFilms.onload = function () {
      data = JSON.parse(xhrFilms.responseText);

      //no more films?

      // Create a list of film titles
      data.forEach((filmObject) => {
        let li = document.createElement("li");
        // Add film title to the li
        li.textContent = filmObject["title"];
        //Add some attributes to the li;
        li.setAttribute("data_id", filmObject["id"]);

        // Add the li element to the films ul
        films.appendChild(li);

        /* const span = document.createElement("span");
        span.textContent = " tickets unavailable"; */

        if (filmObject["tickets_sold"] === filmObject["capacity"]) {
          li.classList.add("sold-out");
        }
      });
    };
  }

  //Adds event listeners to our titles in the ul#films
  const titleListElements = document.querySelector("ul");
  titleListElements.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      //the code below styles our selected movie

      const activeList = document.querySelectorAll("li.active");
      for (const listElement of activeList) {
        listElement.classList.remove("active");
      }
      e.target.classList.add("active");

      //lets fetch the id of the clicked, from the attribute we gave it
      const dataId = e.target.getAttribute("data_id");
      //fetch and display film with that title from the database;
      let xhrFilmSelected = new XMLHttpRequest();
      // Define the URL of the API endpoint
      const urlFilmSelected = "http://localhost:3000/films/" + dataId;

      // Open the request
      xhrFilmSelected.open("GET", urlFilmSelected, true);

      // Send the request
      xhrFilmSelected.send();

      //next film's data
      xhrFilmSelected.onload = function () {
        data = JSON.parse(xhrFilmSelected.responseText);

        // Display the clicked film's details

        const poster = document.getElementById("poster");
        poster.src = data.poster;

        const title = document.getElementById("title");
        title.textContent = data.title;

        const runtime = document.getElementById("runtime");
        runtime.textContent = `${data.runtime} minutes`;

        const showtime = document.getElementById("showtime");
        showtime.textContent = data.showtime;

        const filmInfo = document.getElementById("film-info");
        filmInfo.textContent = data["description"];

        capacity = data["capacity"];

        ticketsSold = data["tickets_sold"];

        remainingTickets = capacity - ticketsSold;
        const ticketNum = document.getElementById("ticket-num");
        ticketNum.textContent = remainingTickets;

        currentFilmID = dataId;

        const p = document.getElementById("selectedP");
        p.textContent = "You've selected..."; //change from "best Selling" to "you selected"
        p.classList.add("p");
        if (capacity === ticketsSold) {
          buyTicket.disabled = true;
          buyTicket.textContent = "Sold Out!";
        } else {
          buyTicket.disabled = false;
          buyTicket.textContent = "Buy Ticket";
        }

        return data, remainingTickets, ticketsSold, capacity;

        //we are sure we are returning our rem tickets.
      };
    }
  });
  /*  mostBoughtFilm() */

  const mostBoughtFilmB = document.getElementById("mostBoughtFilm");
  mostBoughtFilmB.addEventListener("click", mostBoughtFilm);

  function mostBoughtFilm() {
    const p = document.getElementById("selectedP");
    p.textContent = "Best Selling Film..."; //change from "best Selling" to "you selected"
    p.classList.add("p");
    // Create an XMLHttpRequest object to fetch films and make films list
    const xhrFilms = new XMLHttpRequest();

    // Define the URL of the API endpoint

    const urlFilms = "http://localhost:3000/films";

    // Open the request
    xhrFilms.open("GET", urlFilms, true);

    // Send the request
    xhrFilms.send();

    // Handle the response
    xhrFilms.onload = function () {
      fetchedData = JSON.parse(xhrFilms.responseText);
      const sortedData = fetchedData.sort((a, b) => {
        return b.tickets_sold - a.tickets_sold;
      });

      data = sortedData[0];

      // Display the film details
      currentFilmID = data.id;

      const poster = document.getElementById("poster");
      poster.src = data.poster;

      const title = document.getElementById("title");
      title.textContent = data.title;

      const runtime = document.getElementById("runtime");
      runtime.textContent = `${data.runtime} minutes`;

      const showtime = document.getElementById("showtime");
      showtime.textContent = data.showtime;

      const filmInfo = document.getElementById("film-info");
      filmInfo.textContent = data["description"];

      remainingTickets = data["capacity"] - data["tickets_sold"]; //declare rem tickets
      const ticketNum = document.getElementById("ticket-num"); //ticket number
      ticketsSold = data["tickets_sold"]; //declare ticketsSold
      capacity = data["capacity"]; //declare capacity

      ticketNum.textContent = remainingTickets;

      if (capacity === ticketsSold) {
        buyTicket.disabled = true;
        buyTicket.textContent = "Sold Out!";
      } else {
        buyTicket.disabled = false;
        buyTicket.textContent = "Buy Ticket";
      }
      return ticketsSold;
    };
  }
});
