"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favStoriesList = $("#favorite-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $storyAddForm = $("#storyAddForm");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm, $storyAddForm];
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();
  if (currentUser) updateUIOnUserLogin();
}
$(start);
