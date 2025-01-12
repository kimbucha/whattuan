class Solution:
    def numDecodings(self, s: str) -> int:
        # Edge case: if string starts with '0', no valid decoding possible
        if not s or s[0] == '0':
            return 0
            
        n = len(s)
        # dp[i] represents number of ways to decode string up to index i
        dp = [0] * (n + 1)
        
        # Empty string has 1 way to decode
        dp[0] = 1
        # First character has 1 way if it's not '0'
        dp[1] = 1 if s[0] != '0' else 0
        
        # Iterate through the string starting from index 1
        for i in range(2, n + 1):
            # Check single digit decode (1-9)
            if s[i-1] != '0':
                dp[i] += dp[i-1]
                
            # Check two digit decode (10-26)
            two_digit = int(s[i-2:i])
            if 10 <= two_digit <= 26:
                dp[i] += dp[i-2]
                
        return dp[n] 