import closest from "./closest"

// Finds the offset position by looking at the passed in node and finding
// the closest `data-slate-leaf` and its clones to determine what the offset
// position was before the split
export default function getSplitPos(node) {
  const slateLeaf = closest(node, "[data-slate-leaf]")
  const offsetKey = slateLeaf.dataset.offsetKey
  const textNodes = document.querySelectorAll(
    `[data-offset-key='${offsetKey}']`
  )

  console.log(slateLeaf, offsetKey)
  console.log("textNodes", textNodes)

  // On Desktop Chrome: This happens if you split at the end of a block
  if (node.nodeType !== Node.TEXT_NODE) {
    console.log(2)
    return { offsetKey, offset: textNodes[0].textContent.length }
  }

  // On Desktop Chrome:
  // This happens if you split at the beginning or end of a node.
  // Does not happen at beginning of block.
  if (textNodes.length === 1) {
    console.log(3)
    return { offsetKey, offset: 0 }
  }

  console.log(4)

  const offset = textNodes[0].textContent.length
  return { offsetKey, offset }
}
