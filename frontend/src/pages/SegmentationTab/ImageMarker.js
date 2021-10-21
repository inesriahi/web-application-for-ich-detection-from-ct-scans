function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }

  var style = document.createElement("style");

  style.setAttribute("type", "text/css");
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, "__esModule", { value: true });

var React = require("react");

/*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

___$insertStyle(
  ".image-marker {\n  position: relative;\n  margin: 0 auto;\n}\n.image-marker__image {\n  margin: 0 auto;\n  width: 100%;\n}\n.image-marker__marker {\n  position: absolute;\n}\n.image-marker__marker--default {\n  width: 25px;\n  height: 25px;\n  background-color: brown;\n  border-radius: 50%;\n  color: white;\n  text-align: center;\n}"
);

var calculateMarkerPosition = function (
  mousePosition,
  imagePosition,
  scrollY,
  bufferLeft,
  bufferTop
) {
  var pixelsLeft = mousePosition.clientX - imagePosition.left;
  var pixelsTop;
  if (imagePosition.top < 0) {
    pixelsTop = mousePosition.pageY - scrollY + imagePosition.top * -1;
  } else {
    pixelsTop = mousePosition.pageY - scrollY - imagePosition.top;
  }
  var top = ((pixelsTop - bufferTop) * 100) / imagePosition.height;
  var left = ((pixelsLeft - bufferLeft) * 100) / imagePosition.width;
  return [top, left];
};

var DEFAULT_BUFFER = 12;

var ImageMarker = React.forwardRef((_a, imageRef) => {
  
  var src = _a.src,
    markers = _a.markers,
    onAddMarker = _a.onAddMarker,
    MarkerComponent = _a.markerComponent,
    _b = _a.bufferLeft,
    bufferLeft = _b === void 0 ? DEFAULT_BUFFER : _b,
    _c = _a.bufferTop,
    bufferTop = _c === void 0 ? DEFAULT_BUFFER : _c,
    _d = _a.alt,
    alt = _d === void 0 ? "Markers" : _d,
    _e = _a.extraClass,
    extraClass = _e === void 0 ? "" : _e;
//   var imageRef = React.useRef(null);
  var handleImageClick = function (event) {
    if (!imageRef.current || !onAddMarker) {
      return;
    }
    var imageDimentions = imageRef.current.getBoundingClientRect();
    var _a = calculateMarkerPosition(
        event,
        imageDimentions,
        window.scrollY,
        bufferLeft,
        bufferTop
      ),
      top = _a[0],
      left = _a[1];
    onAddMarker({
      top: top,
      left: left,
    });
  };
  var getItemPosition = function (marker) {
    return {
      top: marker.top + "%",
      left: marker.left + "%",
    };
  };
  return React.createElement(
    "div",
    { className: "image-marker" },
    React.createElement("img", {
      src: src,
      alt: alt,
      onClick: handleImageClick,
      className: "image-marker__image " + extraClass,
      ref: imageRef,
    }),
    markers.map(function (marker, itemNumber) {
      return React.createElement(
        "div",
        {
          className:
            "image-marker__marker " +
            (!MarkerComponent && "image-marker__marker--default"),
          style: getItemPosition(marker),
          key: itemNumber,
          "data-testid": "marker",
        },
        MarkerComponent
          ? React.createElement(
              MarkerComponent,
              __assign({}, marker, { itemNumber: itemNumber })
            )
          : itemNumber + 1
      );
    })
  );
});

exports.default = ImageMarker;
//# sourceMappingURL=index.js.map
