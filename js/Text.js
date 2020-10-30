// This class is not used in the project yet.
class Text {
  // The constructor has four parameters. Here is an example of how you would create
  // an instance of this class
  constructor(root, xPos, yPos, size) {
    // We create a DOM element, set its CSS attributes then append it to the parent DOM element. We also
    // set the \`domElement\` property of the instance to the newly created DOM element so we can update it later
    const div = document.createElement('div');

    div.style.position = 'absolute';
    div.style.left = xPos;
    div.style.top = yPos;
    div.style.color = '#23f502';
    div.style.textShadow = '2px 2px 2px black'
    div.style.fontFamily = 'ZCOOL QingKe HuangYou, cursive';
    div.style.fontSize = size;
    div.style.zIndex = 2000;
    root.appendChild(div);
    this.domElement = div;
  }

  // This method is used to update the text displayed in the DOM element
  update(txt) {
    this.domElement.innerText = txt;
  }
}
