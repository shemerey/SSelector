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

function alert(msg, title){
  NSApplication.sharedApplication().displayDialog_withTitle_(msg, title)
}

function selectionErrorHandling(context)
{
  // Nothing selected
  if(context.selection.count() == 0) {
    alert(
      "You must select a layer in order to use this plugin.",
      "No layers selected!"
    )
    return false;
  }

  // More than one layer selected
  if(context.selection.count() > 1) {
    alert(
      "This plugin doesn't work with multiple layers. Please select a single layer and try again.",
      "Multiple layers selected!"
    )
    return false;
  }


  // Group selected
  var firstObject = context.selection.firstObject();
  if([firstObject class] == MSLayerGroup) {
    alert(
      "This plugin doesn't work with groups. Please select a layer instead.",
      "You've selected a group!"
    )
    return false;
  }

  // Slice selected
  if([firstObject class] == MSSliceLayer) {
    alert(
      "This plugin doesn't work with slices. Please select a layer instead.",
      "You've selected a slice!"
    )
    return false;
  }

  return true;
}
