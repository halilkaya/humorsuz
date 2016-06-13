var getRandomImage = function (type) {
  var images = _.values(
    window.__IMAGES__
  ).filter(
    function (image) {
      return image[1] === type;
    }
  );

  return _.sample(images);
};

var getRandomCoverImage = getRandomImage.bind(this, 'cover');
var getRandomObjectImage = getRandomImage.bind(this, 'centered');

var VOWELS = ['ı', 'i', 'ü', 'u', 'ö', 'o', 'a', 'e'];
var FORMATTERS = {
  'quote': function (string) {
    return string + "'"
  },
  
  'towards': function (string) {
    var raw = string.replace("'", '');

    if (
      [
        'a', 'u', 'o', 'ı'
      ].indexOf(raw[raw.length - 2]) > -1
    ) {
      return string + 'a';
    } else {
      return string + 'e';
    }
  },

  'static': function (string) {
    var raw = string.replace("'", '');

    if (
      ['p', 'ç', 't', 'k', 's', 'ş', 'h', 'f'].indexOf(
        raw[raw.length - 1]
      ) > -1
    ) {
      string = string + 't';
    } else {
      string = string + 'd';
    }
    
    if (
      ['ü', 'ö', 'i'].indexOf(raw[raw.length - 2]) > -1
    ) {
      string = string + 'e';
    } else {
      string = string + 'a';
    }
    
    return string
  },

  'containing': function (string) {
    var raw = string.replace("'", '');
    var mutationIndex;

    if (
      VOWELS.indexOf(raw[raw.length - 1]) > -1
    ) {
      mutationIndex = raw.length - 1;
    } else {
      mutationIndex = raw.length - 2;
    };

    var suffixes = {
      'u': 'lu',
      'ü': 'lü',
      'o': 'lu',
      'ö': 'lü',
      'ı': 'lı',
      'i': 'li',
      'a': 'lı',
      'e': 'li'
    };

    return string + (suffixes[raw[mutationIndex]] || ' ile');
  }
};

var renderImages = function (images) {
  var cover = _.find(images, function (image) {
    return image[1] === 'cover';
  }) || getRandomCoverImage();

  var object = _.find(images, function (image) {
    return image[1] === 'centered';
  }) || getRandomObjectImage();

  var template = _.template(
    document.getElementById('image-template').innerHTML
  );

  return template({
    cover: 'img/objects/' + cover[0],
    object: 'img/objects/' + object[0]
  });
};

var getRandomObject = function (type) {
  var objects = window.__OBJECTS__;
  return _.sample(objects[type]);
};

var getImages = function (objects) {
  var images = window.__IMAGES__;

  return objects.map(function (object) {
    return images[object]
  }).filter(Boolean);
};

var titleCase = function (string) {
  return (
    string[0].toUpperCase() + string.substr(1, string.length)
  );
};

var generate = function () {
  var drafts = window.__DRAFTS__;
  var sample = _.sample(drafts);

  var render = _.template(sample);

  var parsedObjects = [];

  var rendered = render({
    random: function (type, formatters) {
      var object = getRandomObject(type);
      
      parsedObjects.push(object);

      if (formatters) {
        formatters.forEach(function (formatter) {
          object = FORMATTERS[formatter](object)
        });
      }

      return object;
    }
  });

  var images = getImages(parsedObjects);
  var renderedImages = renderImages(images);

  document.getElementById('title').innerHTML = titleCase(rendered);
  document.getElementById('images').innerHTML = renderedImages;
};

var initApp = function () {
  generate();

  var generateButton = document.getElementById('generate');

  generateButton.addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      generate();
    }
  );
};