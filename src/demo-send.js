import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax';
/**
 * `data-send`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
// challenge 2: first audio is empty
// challenge 3: audio is cached of first routed page. so subsequent routes audio is not playing
class DataSend extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .songs-container{
          display: block;
        }
        .art {
          background-size: cover;
          width: 300px;
          height: 300px;
          display: inline-block;
          margin: 10px;
          float: left;
          border: 3px solid black;
          position: relative;
        }
        .song-name {
          color: white;
          font-size: 25px;
          text-align: center;
          text-shadow: 0px 2px 35px rgba(20, 20, 20, 0.88);
        }
        audio {
          width: 300px;
          height: 54px;
          position: absolute;
          bottom: 0;
        }
      </style>

      <!-- use iron-ajax to make api-calls with the selected playlist.id
           and get the list of songs -->
      <iron-ajax
                  auto
                  url="https://api.napster.com/v2.0/playlists/[[prop1]]/tracks?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm&limit=200"
                  handle-as = "json"
                  on-response="handleResponse"
                  last-response="{{ajaxResponse}}">
      </iron-ajax>
      
      <div class="songs-container">
      <template is="dom-repeat" items="[[allTracks]]">

        <!--<div>item.imageUrl=[[item.imageUrl]]</div>
        <div>item.albumName=[[item.albumName]]</div>
        <div>item.previewURL=[[item.previewURL]]</div>
        <hr>   -->   

        <div class="art" style="background-image:url('[[item.imageUrl]]')">
         <div class="song-name"> [[item.albumName]] </div>
          <audio controls class="audio">
            <source src="[[item.previewURL]]" type="audio/mpeg">
          </audio>
        </div> 
      </template>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'data-send',
      },
      allTracks: {
        type: Array,
        value: [{}],
      }
    };
  }

  handleResponse(event, request) { 
    let tracks = request.response.tracks;
    this.allTracks = [];
    for(let track of tracks){
      let albumName = track.name;
      let artistName = track.artistName;
      let previewURL = track.previewURL;
      let imageUrl = `http://direct.rhapsody.com/imageserver/v2/albums/${track.albumId}/images/300x300.jpg`;
      this.allTracks.push({albumName, artistName, previewURL, imageUrl});
    }
  }
}

window.customElements.define('data-send', DataSend);
