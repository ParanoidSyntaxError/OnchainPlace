import { PixelSet, Mint } from "../generated/Contract/Contract"
import { Change, Pixel, Token } from "../generated/schema"

export function handleMint(event: Mint): void {
  let token = new Token(event.params.id.toString());
  token.owner = event.params.owner;
  token.totalChanges = event.params.totalChanges;
  token.save();
}

export function handlePixelSet(event: PixelSet): void {
  const loadedPixel = Pixel.load(event.params.position.toString());

  if(loadedPixel == null || loadedPixel.totalChanges < event.params.totalChanges) {
    let pixel = new Pixel(event.params.position.toString());
    pixel.position = event.params.position;
    pixel.color = event.params.color;
    pixel.totalChanges = event.params.totalChanges;
    pixel.save();
  }

  let change = new Change(event.params.totalChanges.toString())
  change.author = event.params.author;
  change.position = event.params.position;
  change.color = event.params.color;
  change.totalChanges = event.params.totalChanges;
  change.save();
}