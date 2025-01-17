# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        # binary search tree
        # given: root of bst and int k
        # return: kth smallest value               

        stack = []
        curr = root

        while curr or stack:
            # Traverse to leftmost node
            while curr:
                stack.append(curr)
                curr = curr.left
            
            # Process current node
            curr = stack.pop()
            k -= 1  # Count down to kth element
            if k == 0:
                return curr.val
            
            # Move to right subtree
            curr = curr.right
            
        return 0  # Should not reach here if k is valid 