// @ts-nocheck
import ExtensionPage, {ExtensionPageAttrs} from "flarum/admin/components/ExtensionPage";
import Mithril from "mithril";
import app from 'flarum/admin/app'
import hljs from 'highlight.js';

export default class SendEmailPage extends ExtensionPage {
  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);
    this.loading = false
    this.getTotalSubscribers()
    this.totalSubscribers = 0;
  }

  content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): JSX.Element {
    return (
      <div className="container">
        <p>
          You are about to send this email to {this.totalSubscribers} users!
        </p>
        <div className="Form-group">
          <label>Subject</label>
          <input
            className="FormControl"
            type="text"
            placeholder="Email Subject"
            oninput={(e: { target: { value: any; }; }) => (this.subject = e.target.value)}
          />
        </div>
        <div className="Form-group">
          <label>Body</label>
          <textarea
            className="FormControl"
            rows="10"
            placeholder="Email Body"
            oninput={(e) => (this.body = e.target.value)}
          ></textarea>
        </div>
        <button
          className="Button Button--primary"
          onclick={this.sendEmail.bind(this)}
          disabled={!this.subject || !this.body}
        >
          {this.loading ? 'Sending...' : 'Send Email to All Subscribers'}
        </button>
      </div>
    )
  }

  getTotalSubscribers() {
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/newsletter/subscribers',
    }).then(data => {
      this.totalSubscribers = data.data.length
      m.redraw()
    })
  }

  sendEmail() {
    this.loading = true
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/newsletter/sendall',
      body: {
        email: this.email,
        subject: this.subject,
        body: this.body,
        html: this.html,
      },
    })
      .then(() => {
        this.loading = false
        app.alerts.show({type: 'success'}, 'Email sent successfully!');
      })
      .catch(() => {
        app.alerts.show({type: 'error'}, 'Failed to send email.');
      });
  }
}
