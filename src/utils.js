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

const outlineArc = function(c, x, y, corner, outerRadius, innerRadius) {
  c.save();
  c.translate(x, y);
  c.rotate(Math.PI*corner*0.5);
  c.beginPath();
  c.moveTo(innerRadius, 0);
  c.arcTo(innerRadius, innerRadius, 0, innerRadius, innerRadius);
  c.lineTo(0, outerRadius);
  c.arcTo(outerRadius, outerRadius, outerRadius, 0, outerRadius);
  c.fill();
  c.restore();
}

export { roundedRect, outlineArc };
