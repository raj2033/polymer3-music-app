/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import '@polymer/iron-ajax';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html `
      <style>
        :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;
        
        display: block;
        }
        
        app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
        }
        
        app-header {
        color: #fff;
        background-color: var(--app-primary-color);
        }
        
        app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
        }
        
        .drawer-list {
        margin: 0 20px;
        }
        
        .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
        }
        
        .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
        }
        
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="view1" href="[[rootPath]]view1">View One</a>
            <a name="view2" href="[[rootPath]]view2">View Two</a>
            <a name="view3" href="[[rootPath]]view3">View Three</a>
            <iron-ajax
              auto
              url="https://api.napster.com/v2.0/playlists?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm"
              handle-as = "json"
              on-response="handleResponse"
              last-response="{{ajaxResponse}}">
            </iron-ajax>
            <template is="dom-repeat" items="[[playlists]]">
              <a name="[[item.id]]" href="[[rootPath]][[item.name ]]">[[item.name]]</a>
            </template>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
          <!-- make api calls to fetch the playlists -->
          <iron-ajax
                  auto
                  url="https://api.napster.com/v2.0/playlists?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm"
                  handle-as = "json"
                  on-response="handleResponse"
                  last-response="{{ajaxResponse}}">
          </iron-ajax>

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">My App</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <my-view404 name="view404"></my-view404>
            <data-send name="playlist" prop1="[[selectedPlaylist]]"></data-send>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      playlists: {
        type: Array,
        reflectToAttribute: true,
        value: 'waiting...',
        reflectToAttribute: true
      },
      playlistNames: {
        type: Array,
        value: [],
        reflectToAttribute: true
      },
      selectedPlaylist: {
        type: String,
        value: 'selectedPlaylist is empty'
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  handleResponse(event, request) { 
    //  get all the playlists from the api call response
    this.playlists = request.response.playlists;

    // get all the playlist names
    for(let playlist of this.playlists) {
      if(this.playlistNames.length < this.playlists.length) {
        this.playlistNames.push(playlist.name);
      }  
    }
  }

  _routePageChanged(page) {
    for(let playlist of this.playlists){
      if(playlist.name === page){
        this.selectedPlaylist = playlist.id;
      }
    }
    if (!page) {
      this.page = 'view404';
    } else if (this.playlistNames.indexOf(page) !== -1) {
      this.page = 'playlist';
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    switch (page) {
      case 'view404':
        import('./my-view404.js');
        break;
      case 'playlist':
        import('./demo-send.js');
        break;
      default:
        console.log('uknown page');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);
