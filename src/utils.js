const roundedRect = function(c, x, y, width, height, radius) {
  c.beginPath();
  c.moveTo(x, y + radius);
  c.lineTo(x, y + height - radius);
  c.arcTo(x, y + height, x + radius, y + height, radius);
  c.lineTo(x + width - radius, y + height);
  c.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  c.lineTo(x + width, y + radius);
  c.arcTo(x + width, y, x + width - radius, y, radius);
  c.lineTo(x + radius, y);
  c.arcTo(x, y, x, y + radius, radius);
  c.fill();
};

export { roundedRect };
