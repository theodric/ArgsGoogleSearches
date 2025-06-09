# Add Arguments to Google Searches
A Firefox addon which allows you to append arbitrary arguments/text to your queries automatically

![screenshot](/screenshot.png)

You can heavily customize the results of a Google search by appending certain text to your query. This add-on allows you to add any such text/arguments automatically, and also to toggle these arguments on and off as you require.

For example, you could add:
1. __```-ai```__ to remove all the Google AI suggestion nonsense (but leave knowledge boxes and highlights extracted from results)
2. __```-site:pinterest.*```__ to remove all pinterest results
3. __```reddit```__ to automatically favor Reddit hits
4. __```"potato"```__ to only accept results which mention the humble potato

v1.2 adds the ability to toggle adding the `&udm=14` parameter to the search URL arguments in order to further nerf the creeping AI. (Thanks to the person on Mastodon who made me aware of this, and who I will happily credit if they wish!) [Read more about udm=14 here](https://tedium.co/2024/05/17/google-web-search-make-default/).  
v1.2 is also opened up to Firefox for Android. The UX is trash, but it does work. Pull requests welcome :)

This add-on does not know who you are, does not care who you are, and does not collect any of your data.

This software is in the public domain. You are encouraged to review and fork the source code as you desire.
