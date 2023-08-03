"use strict";
let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
  putFavStoriesOnPage();
}

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      
      <li id="${story.storyId}"class="highlight">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <label for="favorites"class="favorites">Favorite?</label>
        <input type="checkbox"name="favorites"id="favoriteBox"class="favorites">
      </li>
    `);
}

function generateFavoritesMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}"class="highlight">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function putStoriesOnPage() {
  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  recallFavorites();
}

function putFavStoriesOnPage() {
  for (let i of currentUser.favorites) {
    let listItem = document.getElementById(`${i}`);
    let newItem = listItem.cloneNode(true);
    $favStoriesList.append(newItem);
  }
  $favStoriesList.show();
}

function addSharedStory() {
  const username = document.getElementById("submit-username");
  const author = document.getElementById("submit-author");
  const title = document.getElementById("submit-title");
  const url = document.getElementById("submit-url");
  const sharedStory = {
    username: username.value,
    author: author.value,
    title: title.value,
    url: url.value,
  };
  storyList.addStory(username.value, sharedStory);
  putStoriesOnPage();
}

$("#submit-button").on("click", function () {
  addSharedStory();
});

function saveFavorites() {
  let favorites = JSON.stringify(currentUser.favorites);
  localStorage.setItem("favorites", favorites);
}

function recallFavorites() {
  if (currentUser) {
    currentUser.favorites = JSON.parse(localStorage.getItem("favorites"));
    let faveInputs = document.querySelectorAll("#favoriteBox");
    for (let i of faveInputs) {
      let boxId = i.parentElement.getAttribute("id");
      if (currentUser.favorites.indexOf(boxId) != -1) {
        i.setAttribute("checked", true);
      }
    }
  }
}

$("#all-stories-list").on("click", function (evt) {
  if (evt.target.nodeName === "INPUT") {
    currentUser.maintainFavorites();
    saveFavorites();
  }
});

$("#remove-story-btn").on("click", function () {
  let state = "delete";
  if (state == "delete") {
    $("li").on("click", async function (evt) {
      if (evt.currentTarget.nodeName === "LI") {
        evt.currentTarget.remove();
        state = null;
      }
      let storyId = evt.currentTarget.getAttribute("id");
      await axios.delete(
        `https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,
        {
          token: currentUser.loginToken,
        }
      );
    });
  }
});
