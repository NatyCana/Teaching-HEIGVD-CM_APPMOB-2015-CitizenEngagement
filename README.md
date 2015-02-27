# Citizen Engagement Mobile Application

This repository contains instructions to build a skeleton application that will serve as a starting point to develop the Citizen Engagement mobile application.
The completed skeleton app is available [here](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_APPMOB-2015-SkeletonApp).

## Prerequisites

These instructions assume that you have implemented and deployed the Citizen Engagement API as described in [this article](http://www.iflux.io/use-case/2015/02/03/citizen-engagement.html) and [this course repository](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS).



## Features

The proposed implementation of the app should allow citizens to do the following:

* add new issues:
  * the user should be able to take a photo of the issue;
  * the issue should be geolocated;
* see existing issues on an interactive map;
* browse the list of existing issues:
  * issues should be sorted by date;
  * the user should be able to see the details of an issue (e.g. date, description, picture, comments).



## 1. Serve the application locally

To make sure everything was set up correctly, use the following command from the repository to serve the application locally in your browser:

    ionic serve

You should see something like this:

![Serving the blank app](setup/blank-app-serve.png)



## 2. Install application dependencies

Install development tools with:

    npm install

[npm](https://www.npmjs.com) reads the list of dependencies to install from `package.json`.

Install application libraries with:

    bower install

[Bower](http://bower.io) reads the list of libraries to install from `bower.json`.
As you can see in the `.bowerrc` configuration file, these libraries will be stored in the `www/lib` directory.



## 3. Rename the main AngularJS module

As the application was generated with Ionic, the module is named `starter`.
Let's name it `citizen-engagement` instead.

Edit `www/js/app.js` and change the name:

```js
angular.module('citizen-engagement', ['ionic'])
```

Note the array used as second argument.
It is the list of the dependencies of the module.
You can see that the main module depends on the Ionic framework,
meaning that you will be able to use Ionic components in the application.

Also update the `ng-app` directive on the `<body>` tag in `www/index.html`, which references the module name:

```html
<body ng-app="citizen-engagement">
```



## 4. Set up the page structure

To support the proposed feature list, we can use a tabbed view with 3 tabs, and an additional details page accessible from the issue list.
Basically our page structure will look like this:

* the issue creation tab;
* the issue map tab;
* the issue list tab:
  * the issue details page.

To have more than one page, we need to set up routing with AngularUI Router.
[AngularUI Router](https://github.com/angular-ui/ui-router) is a routing framework which allows you to organize the parts of your interface into a *state machine*.
In this Ionic app, we will only use a subset of this routing functionality.
Basically we will define a state for each page we want to display in the app.

### Create the templates

Create the `www/templates` directory where we will put the page templates:

    mkdir www/templates

To use tabs in the app, we will use the `<ion-tabs>` directive provided by Ionic ([ion-tabs documentation](http://ionicframework.com/docs/api/directive/ionTabs/)).
To define the 3 tabs, we actually need 4 templates: one template to define the list of tabs, and one template for the contents of each tab.

Let's create the `tabs.html` template in the directory we just created.
In here we will put the `<ion-tabs>` directive and define the 3 tabs (new issue, issue map and issue list):

```html
<ion-tabs class="tabs-icon-top tabs-color-active-positive">
  <ion-tab title="New Issue" icon-off="ion-plus-round" icon-on="ion-plus-round" href="#/tab/newIssue">
    <ion-nav-view name="tab-newIssue"></ion-nav-view>
  </ion-tab>
  <ion-tab title="Issue Map" icon-off="ion-map" icon-on="ion-map" href="#/tab/issueMap">
    <ion-nav-view name="tab-issueMap"></ion-nav-view>
  </ion-tab>
  <ion-tab title="Issue List" icon-off="ion-navicon-round" icon-on="ion-navicon-round" href="#/tab/issueList">
    <ion-nav-view name="tab-issueList"></ion-nav-view>
  </ion-tab>
</ion-tabs>
```

Create another 3 templates, one for each tab: `newIssue.html`, `issueMap.html` and `issueList.html` (in the same directory).
The contents of each should be something like this:

```html
<ion-view view-title="New Issue">
  <ion-content>
    <p>Hello! This is the issue creation page.</p>
  </ion-content>
</ion-view>
```

It's just a navbar title and message so we know we are in the right place.

Your `www/templates` directory should now contain 4 files:

    newIssue.html
    issueList.html
    issueMap.html
    tabs.html

Now that we have the templates, we need to tell Ionic where to display them.
You can do this by adding an `<ion-nav-view>` tag in the `index.html` page.
This is where the contents of each template will be inserted depending on the current state (or route).

We also need a navigation bar at the top to display our view titles,
which Ionic provides with the `<ion-nav-bar>` tag.

Update the `<body>` of the `index.html` page to look like this:

```html
<body ng-app="citizen-engagement">

  <!--
    The nav bar that will be updated as we navigate between views.
  -->
  <ion-nav-bar class="bar-stable">
    <ion-nav-back-button>
    </ion-nav-back-button>
  </ion-nav-bar>

  <!--
    The views will be rendered in the <ion-nav-view> directive below
    Templates are in the /templates folder (but you could also
    have templates inline in this html file if you'd like).
  -->
  <ion-nav-view></ion-nav-view>
</body>
```

### Define the states (or routes)

Third, we need to define the states (or routes) for the 3 pages.

Actually, for a tabbed view, we need 4 states, not 3, because one abstract state will be used to represent the tabs.

Let's configure the states in `www/app.js`.
You can add this `.config` block after the existing `.run` block at the end of the file:

```js
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // This is the abstract state for the tabs directive.
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html' // This is where the 3 tabs are defined.
    })

    // The three next states are for each of the three tabs.
    .state('tab.newIssue', {
      url: '/newIssue',
      views: {
        'tab-newIssue': {
          templateUrl: 'templates/newIssue.html' // This is where each tab template is used.
        }
      }
    })

    .state('tab.issueMap', {
      url: '/issueMap',
      views: {
        'tab-issueMap': {
          templateUrl: 'templates/issueMap.html'
        }
      }
    })

    .state('tab.issueList', {
      url: '/issueList',
      views: {
        'tab-issueList': {
          templateUrl: 'templates/issueList.html'
        }
      }
    })

    // This is the issue details state.
    .state('tab.issueDetails', {
      url: '/issueDetails/:issueId',
      views: {
        // This will be displayed in the same tab as the issue list.
        'tab-issueList': {
          templateUrl: 'templates/issueDetails.html'
        }
      }
    })
  ;

  // Define the default state (i.e. the first page displayed when the app opens).
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('tab.newIssue'); // Go to the new issue tab by default.
  });
});
```



## 5. Set up security

To use the app, a citizen should identify him- or herself.
The 3 tabs should not be accessible until after login.

First, let's create a login page.
Add a `login.html` template in `www/templates`:

```html
<ion-view view-title="Citizen Engagement">
  <ion-content class="padding">

    <!-- A short welcome message. -->
    <div class="card">
      <div class="item item-text-wrap">
        Welcome to Citizen Engagement!
        Please identify yourself to use the application.
      </div>
    </div>

    <!-- The login form that the citizen must fill. -->
    <form name="loginForm">

      <!-- An Ionic list is used to group input related input elements. -->
      <div class="list">
        <label class="item item-input">
          <!-- Note the required="required" attribute used for validation. -->
          <input type="text" placeholder="First Name" ng-model="user.firstname" required="required"/>
        </label>
        <label class="item item-input">
          <input type="text" placeholder="Last Name" ng-model="user.lastname" required="required"/>
        </label>
      </div>

      <!-- Display an error message here, above the submit button, if an error occurred. -->
      <p ng-if="error" class="error">{{ error }}</p>

      <!--
        The submit button.
        The "ng-click" directive indicates which scope function is called when the form is submitted.
        The "ng-disabled" directive is used to disable the button if the form is invalid (i.e. the first name or last name is missing).
      -->
      <button class="button button-full button-positive" ng-click="register()" ng-disabled="loginForm.$invalid">Register</button>
    </form>
  </ion-content>
</ion-view>
```
