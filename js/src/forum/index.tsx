import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage'
import NewsLetterBox from "./components/NewsLetterBox";

app.initializers.add('justoverclock/newsletter', () => {
  // TODO: add route for opt out
  extend(IndexPage.prototype, 'sidebarItems', function (items) {
    items.add(
      'newsLetterBox',
      <NewsLetterBox />
    )
  })
});
