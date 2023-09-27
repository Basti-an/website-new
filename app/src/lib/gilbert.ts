/*
  Generalized Hilbert ('gilbert') space-filling curve for arbitrary-sized
  2D rectangular grids. Generates discrete 2D coordinates to fill a rectangle
  of size (width x height).
  Ported from https://github.com/jakubcerveny/gilbert/blob/master/gilbert2d.py
  */

function sgn(x: number) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}

function* generate2d(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): Generator<number[]> {
  let ax2, ay2, bx2, by2;
  const w = Math.abs(ax + ay);
  const h = Math.abs(bx + by);
  const [dax, day] = [sgn(ax), sgn(ay)];
  const [dbx, dby] = [sgn(bx), sgn(by)];

  if (h === 1) {
    for (let i = 0; i < w; i += 1) {
      yield [x, y];
      [x, y] = [x + dax, y + day];
    }

    return;
  }

  if (w === 1) {
    for (let i = 0; i < h; i += 1) {
      yield [x, y];
      [x, y] = [x + dbx, y + dby];
    }

    return;
  }

  [ax2, ay2] = [Math.floor(ax / 2), Math.floor(ay / 2)];
  [bx2, by2] = [Math.floor(bx / 2), Math.floor(by / 2)];
  const w2 = Math.abs(ax2 + ay2);
  const h2 = Math.abs(bx2 + by2);

  if (2 * w > 3 * h) {
    if (w2 % 2 && w > 2) {
      [ax2, ay2] = [ax2 + dax, ay2 + day];
    }

    yield* generate2d(x, y, ax2, ay2, bx, by);
    yield* generate2d(x + ax2, y + ay2, ax - ax2, ay - ay2, bx, by);
  } else {
    if (h2 % 2 && h > 2) {
      [bx2, by2] = [bx2 + dbx, by2 + dby];
    }

    yield* generate2d(x, y, bx2, by2, ax2, ay2);
    yield* generate2d(x + bx2, y + by2, ax, ay, bx - bx2, by - by2);
    yield* generate2d(
      x + (ax - dax) + (bx2 - dbx),
      y + (ay - day) + (by2 - dby),
      -bx2,
      -by2,
      -(ax - ax2),
      -(ay - ay2),
    );
  }
}

export default function* gilbert2d(width: number, height: number): Generator<number[]> {
  if (width >= height) {
    yield* generate2d(0, 0, width, 0, 0, height);
  } else {
    yield* generate2d(0, 0, 0, height, width, 0);
  }
}
