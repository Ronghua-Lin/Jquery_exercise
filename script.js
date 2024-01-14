$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);

  // Get a page number from the url
  const currentPage = urlParams.get("page") ? Number(urlParams.get("page")) : 1;

  const baseUrl = window.location.href.split("?")[0];

  //generating page numbers near prev and next button and fetch data
  updatePageNumbers(currentPage);
  fetchData(currentPage);

  //all buttons are just click to navigate to different pages
  $("#pageNumbers").on("click", ".pageNumber", function () {
    const currentPage = parseInt($(this).data("page"));
    window.location.href = baseUrl + `?page=${currentPage}`;
  });

  $("#prevButton").click(function () {
    if (currentPage === 1) {
      window.alert("this is the first page!");
    } else {
      window.location.href = baseUrl + `?page=${currentPage - 1}`;
    }
  });

  $("#nextButton").click(function () {
    window.location.href = baseUrl + `?page=${currentPage + 1}`;
  });

  $("#pageContent").on("click", "#backButton", function () {
    //redirect back from the 404 page
    window.history.back();
  });

  $("#jumpButton").click(function () {
    var inputValue = Number($("#jumpNumber").val());
    if (!isNaN(inputValue)) {
      window.location.href = baseUrl + `?page=${inputValue}`;
    } else {
      alert("Please enter a valid number");
    }
  });
});

function fetchData(page) {
  fetch(`https://www.adelphi.edu/wp-json/wp/v2/event?page=${page}`)
    .then((response) => {
      if (response.status === 400) {
        return $("#pageContent").load("pageNotFound.html");
      }
      return response.json();
    })
    .then((data) => {
      let listHtml = "";

      //create html template for each data fetched
      data.forEach((item) => {
        const template = `<div class="max-w-md w-full lg:max-w-full lg:flex my-4 bg-white shadow-lg rounded-lg overflow-hidden h-auto lg:h-80">

                            <img
                                class="h-48 lg:h-auto lg:w-auto flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                                src="${item.image}"
                                alt="${item.image_alt_text}"
                                title="${item.image_alt_text}"
                                style="object-fit: cover;"
                            />
                            <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal w-full">
                                <div class="mb-8">
                                    <div class="text-gray-900 font-bold text-xl mb-2">${
                                      item.title
                                    }</div>
                                    <p class="text-gray-700 text-base flex p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>Period: ${getDate(
                                          item.date,
                                          item.end
                                        )}</p>
                                    <p class="text-gray-700 text-base flex p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>Location: ${item.location}</p>
                                    <p class="text-gray-700 text-base p-1">Event Details: <a href=${
                                      item.link
                                    } class="hover:text-blue-300">${item.link}</a></p>
                                </div>
                           
                            </div>
                        </div>`;

        listHtml += template;
      });

      $("#dataList").html(listHtml);
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      $("#loadingSpinner").hide();
      $("#pageContent").show();
    });
}

function updatePageNumbers(currentPage) {
  const displayLength = currentPage <= 5 ? 10 : currentPage + 5;

  let pageNumbersHtml = "";
  for (
    let i = currentPage <= 5 ? 1 : currentPage - 4;
    i <= displayLength;
    i++
  ) {
    pageNumbersHtml += `<button class="pageNumber px-0.5 ${
      i === currentPage ? "bg-blue-500 text-white" : ""
    }" data-page="${i}">${i}</button>`;
  }
  $("#pageNumbers").html(pageNumbersHtml);
}

function getDate(startDate, endDate) {
  const begin = new Date(startDate);
  const end = new Date(endDate);

  const beginDate = begin.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const lastDate = end.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const result = `${beginDate} - ${lastDate}`;
  return result;
}
