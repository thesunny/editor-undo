const LEAF_MATCH = 1
const LEAF_UNIQUE = 2
const NODE_MATCH = 3
const NODE_UNIQUE = 4

function compare(firstEl, secondEl) {
  // console.log({ firstEl, secondEl })
  const first = firstEl.dataset
  const second = secondEl.dataset
  // console.log({ first, second })
  if (first.slateLeaf) {
    return first.offsetKey === second.offsetKey ? LEAF_MATCH : LEAF_UNIQUE
  }
  return first.key === second.key ? NODE_MATCH : NODE_UNIQUE
}

// START/MIDDLE/END OF BLOCK
// START/MIDDLE/END OF SPAN
// START/MIDDLE/END OF BOLD SPAN
// START/MIDDLE/END OF BOLD/ITALIC SPAN
// first block, second, block, third block
// check original refs are correct and restore if they aren't which is most
// likely


// Moves all elements from the clone back into the original except for the
// matching ones.
export default function stitchDivs(first, second) {
  // First, we leave alone all the elements if the first with the possible
  // exception of the last element. That element might be cloned into the
  // second by Android when doing the split.

  // convert to array to kill dynamic nature of childNodes list
  const childNodes = Array.from(second.childNodes)

  const { lastChild } = first
  const firstChild = childNodes[0]

  const comparison = compare(lastChild, firstChild)

  switch (comparison) {
    case LEAF_MATCH:
      lastChild.textContent += firstChild.textContent
      break
    case LEAF_UNIQUE:
      // If it's a unique leaf, we assume it got split right at the end.
      // not sure if this is what heppens...
      console.warn("not sure if this is ever supposed to happen")
      first.appendChild(firstChild)
      break
    case NODE_MATCH:
      // If they are a match, we need to go one deeper to split at the next
      // depth.
      stitchDivs(lastChild, firstChild)
      break
    case NODE_UNIQUE:
      // If they are not a match, we just need to copy it over
      first.appendChild(firstChild)
  }

  for (let i = 1; i < childNodes.length; i++) {
    first.appendChild(childNodes[i])
  }
}

// Returns an immediate child of the root node that is closest to the
// given node.
function findChildNode(node) {
  const grandparent = node.parentElement.parentElement
  if (!grandparent) return null
  const { dataset } = grandparent
  if (!dataset) return node
  if (
    !dataset.key &&
    !dataset.slateLeaf &&
    !dataset.slateMark &&
    !dataset.slateContent
  )
    return node
  return findChildNode(node.parentElement)
}

export function stitchFromNode(startNode) {
  const node = findChildNode(startNode)
  if (!node) return null
  const dataKey = node.dataset.key
  const divs = document.querySelectorAll(`[data-key='${dataKey}']`)
  if (divs.length < 2) return null
  const result = stitchDivs(divs[0], divs[1])
  divs[1].parentElement.removeChild(divs[1])
  return result
}
