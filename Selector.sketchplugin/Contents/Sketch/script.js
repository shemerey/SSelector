// Hello World, by Sam Deane — Source code available at [GitHub](https://github.com/BohemianCoding/plugins.examples.hello-world)
//
// This is an extremely simple plugin example, which illustrates how to add a menu command to the Plugins menu
// and execute some code when it is selected.

//
// ## Layout
//
// The first thing to do when making a plugin is to setup the folder structure, which should
// look something like this:
//
// ```
//    MyPlugin.sketchplugin/
//      Contents/
//        Sketch/
//          manifest.json
//          script.js
// ```
//
// ## Manifest
//
// The plugin needs a `manifest.json` file. This tells Sketch which menu items your plugin supplies,
// as well as giving some general information about the plugin such as its name, author, and so on.
//
// A single plugin can supply multiple menu items, and each one can execute different code,
// or they can all share code. In our case though, we just have one command.
//
//  ```json
// {
//     "name" : "Hello World!",
//     "identifier" : "com.sketchapp.examples.helloworld",
//     "version" : "1.0",
//     "description" : "Pretty much the smallest example Sketch Plugin you could have.",
//     "authorEmail" : "sam@sketchapp.com",
//     "author" : "Sam Deane",
//     "commands" : [
//     {
//       "script" : "hello-world.js",
//       "handler" : "onRun",
//       "shortcut" : "",
//       "name" : "Hello World!",
//       "identifier" : "helloworld"
//     }
//   ]
// }
// ```

// ## Code
// ### Defining The Run Handler
//
// In the manifest, we told Sketch that every time the "Hello World!" menu is selected,
// we want to execute  a javascript handler called `onRun`.
//
// So now we need to put some code into the `hello-world.js` file to implement that command.
function log(x){
  NSApplication.sharedApplication().displayDialog(x)
}

function onRun(context) {
  // Error handling
  if(!selectionErrorHandling(context)) { return }



  // var selectedLayer = context.selection.firstObject();
  var selectedLayer = context.selection[0]
  var selectedFill = getFill(selectedLayer)
  var doc = context.document
  var page = doc.currentPage()
  var artboards = page.artboards()

  for (var i = 0, l = artboards.count(); i < l; i++) {
    if (artboard = artboards.objectAtIndex(i)){
      var layers = artboard.layers()
      for (var j = 0; j < layers.count(); j++) {
        var target = layers.objectAtIndex(j)

        if (selectedFill.isEqual(getFill(target))) {
          target.select_byExpandingSelection(true, true)
        }
      }
    }
  }
};


function getFill(layer){
  return layer.style().fills().firstObject().colorGeneric()
}

function selectionErrorHandling(context)
{
  if(context.selection.count() == 0) // Nothing selected
  {
    [[NSApplication sharedApplication] displayDialog:"You must select a layer in order to use this plugin." withTitle:"No layers selected!"];
    return false;
  }

  if(context.selection.count() > 1) // More than one layer selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with multiple layers. Please select a single layer and try again." withTitle:"Multiple layers selected!"];
    return false;
  }


  var firstObject = context.selection.firstObject();
  if([firstObject class] == MSLayerGroup) // Group selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with groups. Please select a layer instead." withTitle:"You've selected a group!"];
    return false;
  }

  if([firstObject class] == MSSliceLayer) // Slice selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with slices. Please select a layer instead." withTitle:"You've selected a slice!"];
    return false;
  }

  return true;
}
