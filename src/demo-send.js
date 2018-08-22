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
class DataSend extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h4>playlist.id = [[prop1]] </h4> <br>

      <!-- use iron-ajax to make api-calls with the selected playlist.id
           and get the list of songs -->
      <iron-ajax
                  auto
                  url="https://api.napster.com/v2.0/playlists/[[prop1]]/tracks?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm&limit=200"
                  handle-as = "json"
                  on-response="handleResponse"
                  last-response="{{ajaxResponse}}">
      </iron-ajax>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'data-send',
      },
      trackNames: {
        type: Array,
        value: [{}],
      }
    };
  }

  handleResponse(event, request) { 
    let tracks = request.response.tracks;
    this.trackNames = [];
    for(let track of tracks){
      let albumName = track.name;
      let artistName = track.artistName;
      let previewURL = track.previewURL;
      this.trackNames.push({albumName, artistName, previewURL});
    }
    console.log('songs list', this.trackNames);
  }
}

window.customElements.define('data-send', DataSend);
