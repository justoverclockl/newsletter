// @ts-nocheck
import ExtensionPage, {ExtensionPageAttrs} from "flarum/admin/components/ExtensionPage";
import Mithril from "mithril";
import app from 'flarum/admin/app'
import Quill from 'quill';

export default class SendEmailPage extends ExtensionPage {
  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);
    this.loading = false
    this.getTotalSubscribers()
    this.totalSubscribers = 0;
    this.toolbarOptions = [
      [{ font: [] }],
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ["blockquote", "code-block"],
      ["link"],
      [{ align: [] }],
    ];
  }

  oncreate(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>) {
    super.oncreate(vnode);

    this.quill = new Quill("#editor-container", {
      theme: "snow",
      modules: {
        toolbar: this.toolbarOptions,
      },
    });

    this.quill.on("text-change", () => {
      this.body = this.quill.getSemanticHTML();
      m.redraw();
    });
  }

  content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): JSX.Element {
    return (
      <div className="container">
        <p class='newsletter-subscribers-count'>
          {app.translator.trans('justoverclock-newsletter.admin.newsletterCountText')} <span className='subscribers-count'>{this.totalSubscribers}</span> {app.translator.trans('justoverclock-newsletter.admin.newsletterCountTextTwo')}
        </p>
        <div className="Form-group">
          <label>{app.translator.trans('justoverclock-newsletter.admin.emailTitle')}</label>
          <input
            className="FormControl"
            type="text"
            placeholder="Email title"
            oninput={(e: { target: { value: any; }; }) => (this.subject = e.target.value)}
          />
        </div>
        <div className="Form-group">
          <label>{app.translator.trans('justoverclock-newsletter.admin.textOrHtml')}</label>
          <div className='editor-container FormControl' id='editor-container'></div>
        </div>
        <button
          className="Button Button--primary"
          onclick={this.sendEmail.bind(this)}
          disabled={!this.subject || !this.body}
        >
          {this.loading ? `${app.translator.trans('justoverclock-newsletter.admin.sendingText')}` : `${app.translator.trans('justoverclock-newsletter.admin.sendEmailButtonText')}`}
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
    this.body = this.quill.getSemanticHTML();
    console.log(this.body)
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
        app.alerts.show({type: 'success'}, `${app.translator.trans('justoverclock-newsletter.admin.emailSentSuccessMessage')}`);
      })
      .catch(() => {
        app.alerts.show({type: 'error'}, `${app.translator.trans('justoverclock-newsletter.admin.emailSentErrorMessage')}`);
      });
  }
}
