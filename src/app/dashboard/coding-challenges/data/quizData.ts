import { Role, QuestionCategory } from '@/app/dashboard/coding-challenges/types/quiz';

export const quizRoles: Role[] = [
 {
  id: 'software-engineer',
  name: 'Software Engineer',
  description: 'Problem-solving and coding challenges',
  questions: [
    {
      id: 'se-1',
      question: 'Write a program to print numbers from 1 to 10.',
      options: [
        'Use a for loop from 1 to 10',
        'Use recursion without base case',
        'Use while(true)',
        'Print only even numbers'
      ],
      correctAnswer: 0,
      explanation: 'A simple for loop printing 1 to 10 completes the task efficiently.',
      category: 'beginner'
    },
    {
      id: 'se-2',
      question: 'Write a program to find the sum of two numbers.',
      options: [
        'Use console.log(a * b)',
        'Use return a + b',
        'Use if condition only',
        'Use recursion'
      ],
      correctAnswer: 1,
      explanation: 'Adding two numbers directly with + gives the sum.',
      category: 'beginner'
    },
    {
      id: 'se-3',
      question: 'Write a function to check if a number is even or odd.',
      options: [
        'Use num % 2 === 0 to check even',
        'Use num / 2 == 1',
        'Use num == 0 always',
        'Use num + 2 == even'
      ],
      correctAnswer: 0,
      explanation: 'The remainder operator (%) helps determine evenness efficiently.',
      category: 'beginner'
    },
    {
      id: 'se-4',
      question: 'Write a function to reverse a string.',
      options: [
        'Use split("").reverse().join("")',
        'Use sort() method',
        'Use push() only',
        'Use while loop to add spaces'
      ],
      correctAnswer: 0,
      explanation: 'Splitting into an array, reversing, and joining gives a reversed string.',
      category: 'beginner'
    },
    {
      id: 'se-5',
      question: 'Find the largest number among three given numbers.',
      options: [
        'Use if-else conditions comparing a, b, and c',
        'Use ++ operator',
        'Use * operator',
        'Return always a'
      ],
      correctAnswer: 0,
      explanation: 'Use conditional checks to compare and find the largest value.',
      category: 'beginner'
    },
    {
      id: 'se-6',
      question: 'Check whether a number is positive, negative, or zero.',
      options: [
        'Use if-else comparing num > 0, num < 0, else zero',
        'Use only num++',
        'Use num--',
        'Return always positive'
      ],
      correctAnswer: 0,
      explanation: 'Comparison operators handle positivity and negativity easily.',
      category: 'beginner'
    },
    {
      id: 'se-7',
      question: 'Calculate the factorial of a number.',
      options: [
        'Multiply numbers from 1 to n in a loop',
        'Add numbers instead',
        'Use subtraction',
        'Return only n'
      ],
      correctAnswer: 0,
      explanation: 'Factorial is computed by multiplying all numbers up to n.',
      category: 'beginner'
    },
    {
      id: 'se-8',
      question: 'Write a program to swap two numbers without using a third variable.',
      options: [
        'Use arithmetic: a = a + b; b = a - b; a = a - b;',
        'Use third temp variable',
        'Return only a',
        'Use loop'
      ],
      correctAnswer: 0,
      explanation: 'You can swap by arithmetic without temporary storage.',
      category: 'beginner'
    },
    {
      id: 'se-9',
      question: 'Write a function to check if a year is a leap year.',
      options: [
        'If divisible by 4 and (not 100 or divisible by 400)',
        'If divisible by 2',
        'If even number',
        'If odd number'
      ],
      correctAnswer: 0,
      explanation: 'Leap year rule is divisible by 4 but not 100, unless also 400.',
      category: 'beginner'
    },
    {
      id: 'se-10',
      question: 'Write a program to print the multiplication table of a number.',
      options: [
        'Use a for loop from 1 to 10 multiplying each iteration',
        'Use recursion',
        'Use break statement only',
        'Use while(false)'
      ],
      correctAnswer: 0,
      explanation: 'A for loop from 1 to 10 printing num * i works perfectly.',
      category: 'beginner'
    },
    {
      id: 'se-11',
      question: 'Write a program to count the number of digits in a number.',
      options: [
        'Convert to string and get length',
        'Add numbers from 1 to n',
        'Use num + num',
        'Divide by zero'
      ],
      correctAnswer: 0,
      explanation: 'Converting to string and using .length gives digit count easily.',
      category: 'beginner'
    },
    {
      id: 'se-12',
      question: 'Write a program to check if a string is a palindrome.',
      options: [
        'Compare string with its reverse',
        'Check only first and last character',
        'Sort string',
        'Add characters'
      ],
      correctAnswer: 0,
      explanation: 'If the reversed string equals the original, it’s a palindrome.',
      category: 'beginner'
    },
    {
      id: 'se-13',
      question: 'Find the sum of all elements in an array.',
      options: [
        'Use reduce((a,b)=>a+b)',
        'Use push()',
        'Use pop()',
        'Use sort()'
      ],
      correctAnswer: 0,
      explanation: 'The reduce function efficiently accumulates the sum of all array elements.',
      category: 'beginner'
    },
    {
      id: 'se-14',
      question: 'Find the maximum number in an array.',
      options: [
        'Use Math.max(...arr)',
        'Use arr[0]',
        'Use sort() ascending',
        'Return arr.length'
      ],
      correctAnswer: 0,
      explanation: 'Math.max with spread operator finds the highest value.',
      category: 'beginner'
    },
    {
      id: 'se-15',
      question: 'Write a program to find the average of n numbers.',
      options: [
        'Sum all numbers and divide by count',
        'Multiply all numbers',
        'Subtract all numbers',
        'Add 1 to each number'
      ],
      correctAnswer: 0,
      explanation: 'Average = sum / number of items.',
      category: 'beginner'
    },
    {
      id: 'se-16',
      question: 'Write a program to print all even numbers from 1 to 50.',
      options: [
        'Use for loop and check num % 2 == 0',
        'Use if(num % 2 != 0)',
        'Print odd only',
        'Use recursion'
      ],
      correctAnswer: 0,
      explanation: 'Checking remainder 0 identifies even numbers.',
      category: 'beginner'
    },
    {
      id: 'se-17',
      question: 'Find the smallest number in an array.',
      options: [
        'Use Math.min(...arr)',
        'Use Math.max(...arr)',
        'Use arr.pop()',
        'Use arr.join()'
      ],
      correctAnswer: 0,
      explanation: 'Math.min finds the smallest element quickly.',
      category: 'beginner'
    },
    {
      id: 'se-18',
      question: 'Count vowels in a string.',
      options: [
        'Use regex /[aeiou]/gi and count matches',
        'Use split("")',
        'Use sort()',
        'Use substring() only'
      ],
      correctAnswer: 0,
      explanation: 'Regex helps match and count vowels efficiently.',
      category: 'beginner'
    },
    {
      id: 'se-19',
      question: 'Write a program to find the square of a number.',
      options: [
        'Use num * num',
        'Use num + num',
        'Use num / num',
        'Use ++num'
      ],
      correctAnswer: 0,
      explanation: 'Multiplying a number by itself gives its square.',
      category: 'beginner'
    },
    {
      id: 'se-20',
      question: 'Convert Celsius to Fahrenheit.',
      options: [
        'Use (C * 9/5) + 32',
        'Use (C * 5/9) + 32',
        'Use C + 32',
        'Use C / 2'
      ],
      correctAnswer: 0,
      explanation: 'Fahrenheit = (C × 9/5) + 32.',
      category: 'beginner'
    },
    {
      id: 'se-21',
      question: 'Find the square root of a number.',
      options: [
        'Use Math.sqrt(num)',
        'Use num * num',
        'Use num / num',
        'Use parseInt()'
      ],
      correctAnswer: 0,
      explanation: 'The Math.sqrt() function returns the square root directly.',
      category: 'beginner'
    },
    {
      id: 'se-22',
      question: 'Reverse an array without using reverse().',
      options: [
        'Use a loop swapping first and last elements',
        'Use push() only',
        'Use pop() only',
        'Use concat()'
      ],
      correctAnswer: 0,
      explanation: 'Swapping elements manually reverses an array.',
      category: 'beginner'
    },
    {
      id: 'se-23',
      question: 'Check if a number is divisible by 5.',
      options: [
        'Use num % 5 === 0',
        'Use num / 5',
        'Use num == 5',
        'Use num * 5'
      ],
      correctAnswer: 0,
      explanation: 'Modulo operator helps check divisibility.',
      category: 'beginner'
    },
    {
      id: 'se-24',
      question: 'Write a program to print the Fibonacci sequence up to n terms.',
      options: [
        'Use loop adding previous two numbers',
        'Use multiplication',
        'Use only addition by 2',
        'Use subtraction'
      ],
      correctAnswer: 0,
      explanation: 'Each number is the sum of the previous two in Fibonacci.',
      category: 'beginner'
    },
    {
      id: 'se-25',
      question: 'Find the length of a string without using length property.',
      options: [
        'Loop until undefined character',
        'Use length',
        'Use split() directly',
        'Use slice()'
      ],
      correctAnswer: 0,
      explanation: 'Manual iteration helps count characters.',
      category: 'beginner'
    },
    {
      id: 'se-26',
      question: 'Check if an element exists in an array.',
      options: [
        'Use includes() method',
        'Use map()',
        'Use join()',
        'Use pop()'
      ],
      correctAnswer: 0,
      explanation: 'The includes() method returns true if the value exists.',
      category: 'beginner'
    },
    {
      id: 'se-27',
      question: 'Find the area of a rectangle.',
      options: [
        'Use length * width',
        'Use length + width',
        'Use width / length',
        'Use Math.sqrt(length)'
      ],
      correctAnswer: 0,
      explanation: 'Area = length × width.',
      category: 'beginner'
    },
    {
      id: 'se-28',
      question: 'Find the perimeter of a square.',
      options: [
        'Use 4 * side',
        'Use side * side',
        'Use side + side',
        'Use side / 4'
      ],
      correctAnswer: 0,
      explanation: 'Perimeter = 4 × side length.',
      category: 'beginner'
    },
    {
      id: 'se-29',
      question: 'Write a program to convert string to lowercase.',
      options: [
        'Use toLowerCase()',
        'Use toUpperCase()',
        'Use trim()',
        'Use concat()'
      ],
      correctAnswer: 0,
      explanation: 'The toLowerCase() method converts all characters to lowercase.',
      category: 'beginner'
    },
    {
      id: 'se-30',
      question: 'Write a program to remove spaces from a string.',
      options: [
        'Use replace(/\\s/g, "")',
        'Use split() only',
        'Use substring()',
        'Use sort()'
      ],
      correctAnswer: 0,
      explanation: 'Regex with replace removes all whitespace globally.',
      category: 'beginner'
    },
    {
      id: 'se-31',
      question: 'Write a function to find the factorial of a number using recursion.',
      options: [
        'if(n==0) return 1; else return n * factorial(n-1);',
        'return n + factorial(n-1);',
        'return n / factorial(n);',
        'return 1 always;'
      ],
      correctAnswer: 0,
      explanation: 'Recursive factorial multiplies n by factorial of (n-1) until base case n==0.',
      category: 'easy'
    },
    {
      id: 'se-32',
      question: 'Find the second largest number in an array.',
      options: [
        'Sort array descending and pick index 1',
        'Use only Math.max()',
        'Reverse array and take first',
        'Use pop() twice'
      ],
      correctAnswer: 0,
      explanation: 'Sorting descending lets you pick the second largest at index 1.',
      category: 'easy'
    },
    {
      id: 'se-33',
      question: 'Check if a number is prime.',
      options: [
        'Loop from 2 to √n and check n % i == 0',
        'If n % 2 == 0 always prime',
        'Return n > 1',
        'Use n/2 == 0'
      ],
      correctAnswer: 0,
      explanation: 'A prime has no divisors other than 1 and itself.',
      category: 'easy'
    },
    {
      id: 'se-34',
      question: 'Reverse words in a given string sentence.',
      options: [
        'Split by space, reverse array, join with space',
        'Use toLowerCase()',
        'Sort words alphabetically',
        'Replace spaces with commas'
      ],
      correctAnswer: 0,
      explanation: 'Splitting and reversing word order reverses the sentence structure.',
      category: 'easy'
    },
    {
      id: 'se-35',
      question: 'Remove duplicate elements from an array.',
      options: [
        'Use [...new Set(arr)]',
        'Use push()',
        'Use sort() only',
        'Use map() only'
      ],
      correctAnswer: 0,
      explanation: 'A Set stores only unique values, easily removing duplicates.',
      category: 'easy'
    },
    {
      id: 'se-36',
      question: 'Find the sum of all even numbers in an array.',
      options: [
        'Filter even numbers then reduce sum',
        'Add all numbers',
        'Subtract odd numbers',
        'Use forEach without condition'
      ],
      correctAnswer: 0,
      explanation: 'Filtering evens and reducing gives total sum of even values.',
      category: 'easy'
    },
    {
      id: 'se-37',
      question: 'Find the number of vowels and consonants in a string.',
      options: [
        'Use regex to count vowels, rest are consonants',
        'Count only vowels',
        'Count only consonants',
        'Use toUpperCase()'
      ],
      correctAnswer: 0,
      explanation: 'Matching vowels with regex helps compute counts easily.',
      category: 'easy'
    },
    {
      id: 'se-38',
      question: 'Find the missing number in an array from 1 to n.',
      options: [
        'Use sum formula n*(n+1)/2 minus actual sum',
        'Use sort()',
        'Use pop()',
        'Use includes() only'
      ],
      correctAnswer: 0,
      explanation: 'Difference between expected and actual sum gives the missing number.',
      category: 'easy'
    },
    {
      id: 'se-39',
      question: 'Count how many times an element appears in an array.',
      options: [
        'Use a loop or reduce with counter',
        'Use sort()',
        'Use Math.max()',
        'Use push()'
      ],
      correctAnswer: 0,
      explanation: 'Looping and incrementing counter tracks occurrences.',
      category: 'easy'
    },
    {
      id: 'se-40',
      question: 'Check if two strings are anagrams.',
      options: [
        'Sort both and compare equality',
        'Compare lengths only',
        'Use includes()',
        'Use indexOf()'
      ],
      correctAnswer: 0,
      explanation: 'Sorting characters and comparing works for anagram detection.',
      category: 'easy'
    },
    {
      id: 'se-41',
      question: 'Find the largest element in each row of a 2D array.',
      options: [
        'Use map(row => Math.max(...row))',
        'Use reduce() once on entire array',
        'Use sort() globally',
        'Use push()'
      ],
      correctAnswer: 0,
      explanation: 'Mapping each row and applying Math.max finds per-row maximum.',
      category: 'easy'
    },
    {
      id: 'se-42',
      question: 'Write a program to check if an array is sorted.',
      options: [
        'Loop and ensure arr[i] <= arr[i+1]',
        'Use sort() directly',
        'Use reverse()',
        'Compare first and last only'
      ],
      correctAnswer: 0,
      explanation: 'Pairwise comparison verifies ascending order.',
      category: 'easy'
    },
    {
      id: 'se-43',
      question: 'Count the number of words in a string.',
      options: [
        'Split by spaces and count length',
        'Count characters',
        'Count vowels',
        'Use trim() only'
      ],
      correctAnswer: 0,
      explanation: 'Splitting on spaces yields total word count.',
      category: 'easy'
    },
    {
      id: 'se-44',
      question: 'Find the smallest and largest element in an array without sorting.',
      options: [
        'Iterate and track min and max values',
        'Use sort()',
        'Use filter()',
        'Use slice()'
      ],
      correctAnswer: 0,
      explanation: 'Single traversal can find both min and max efficiently.',
      category: 'easy'
    },
    {
      id: 'se-45',
      question: 'Calculate the sum of digits of a number.',
      options: [
        'Use while loop with num % 10 and floor division',
        'Add numbers directly',
        'Use string length',
        'Use sort()'
      ],
      correctAnswer: 0,
      explanation: 'Remainder and division extract digits for summation.',
      category: 'easy'
    },
    {
      id: 'se-46',
      question: 'Reverse a number (e.g., 123 → 321).',
      options: [
        'Use loop extracting digits via %10',
        'Use sort()',
        'Use push()',
        'Use slice()'
      ],
      correctAnswer: 0,
      explanation: 'Digit extraction and multiplication rebuild reversed number.',
      category: 'easy'
    },
    {
      id: 'se-47',
      question: 'Check if a number is an Armstrong number.',
      options: [
        'Sum of cubes of digits equals number',
        'Even number check',
        'Odd number check',
        'Divisible by 3 only'
      ],
      correctAnswer: 0,
      explanation: 'Armstrong numbers equal the sum of their digits’ cubes (for 3-digit).',
      category: 'easy'
    },
    {
      id: 'se-48',
      question: 'Find all factors of a given number.',
      options: [
        'Loop from 1 to n and check n % i == 0',
        'Use sum()',
        'Use divide()',
        'Use array length'
      ],
      correctAnswer: 0,
      explanation: 'Modulo operator helps identify divisors of n.',
      category: 'easy'
    },
    {
      id: 'se-49',
      question: 'Find GCD (Greatest Common Divisor) of two numbers.',
      options: [
        'Use Euclidean algorithm',
        'Multiply both numbers',
        'Add both numbers',
        'Subtract both once'
      ],
      correctAnswer: 0,
      explanation: 'Euclidean algorithm repeatedly applies a % b until b = 0.',
      category: 'easy'
    },
    {
      id: 'se-50',
      question: 'Find LCM of two numbers.',
      options: [
        'Use (a*b)/GCD(a,b)',
        'Use a+b',
        'Use a*b',
        'Use subtraction'
      ],
      correctAnswer: 0,
      explanation: 'LCM × GCD = product of numbers.',
      category: 'easy'
    },
    {
      id: 'se-51',
      question: 'Check if a number is a perfect number.',
      options: [
        'Sum of proper divisors equals the number',
        'Divisible by 2',
        'Odd number',
        'Prime number'
      ],
      correctAnswer: 0,
      explanation: 'Perfect number equals sum of its divisors (excluding itself).',
      category: 'easy'
    },
    {
      id: 'se-52',
      question: 'Find common elements between two arrays.',
      options: [
        'Use filter with includes()',
        'Use concat()',
        'Use push()',
        'Use reduce()'
      ],
      correctAnswer: 0,
      explanation: 'Filtering one array with includes() finds shared elements.',
      category: 'easy'
    },
    {
      id: 'se-53',
      question: 'Remove falsy values (false, 0, "", null, undefined, NaN) from an array.',
      options: [
        'Use arr.filter(Boolean)',
        'Use map()',
        'Use sort()',
        'Use pop()'
      ],
      correctAnswer: 0,
      explanation: 'filter(Boolean) keeps only truthy values.',
      category: 'easy'
    },
    {
      id: 'se-54',
      question: 'Find intersection of two sorted arrays.',
      options: [
        'Use two-pointer technique',
        'Use concat()',
        'Use reverse()',
        'Use map()'
      ],
      correctAnswer: 0,
      explanation: 'Two-pointer method efficiently finds common elements in sorted arrays.',
      category: 'easy'
    },
    {
      id: 'se-55',
      question: 'Find the frequency of each character in a string.',
      options: [
        'Use loop and object counter',
        'Use sort()',
        'Use join()',
        'Use substring()'
      ],
      correctAnswer: 0,
      explanation: 'Mapping character counts via object or Map stores frequency.',
      category: 'easy'
    },
    {
      id: 'se-56',
      question: 'Count how many even and odd digits are in a number.',
      options: [
        'Extract digits with %10 and check remainder',
        'Sum all digits',
        'Multiply digits',
        'Use length property'
      ],
      correctAnswer: 0,
      explanation: 'Modulo 2 determines even or odd digit.',
      category: 'easy'
    },
    {
      id: 'se-57',
      question: 'Find the sum of n natural numbers using a formula.',
      options: [
        'Use n*(n+1)/2',
        'Use loop always',
        'Use n^2',
        'Use factorial'
      ],
      correctAnswer: 0,
      explanation: 'Sum of n natural numbers = n(n+1)/2.',
      category: 'easy'
    },
    {
      id: 'se-58',
      question: 'Generate multiplication table from 1 to 10 for any number n.',
      options: [
        'Loop i = 1 to 10 → print n * i',
        'Use recursion only',
        'Use pop()',
        'Use filter()'
      ],
      correctAnswer: 0,
      explanation: 'A simple loop produces multiplication output.',
      category: 'easy'
    },
    {
      id: 'se-59',
      question: 'Check whether a string contains only digits.',
      options: [
        'Use regex /^\\d+$/',
        'Use isNaN() only',
        'Use parseInt()',
        'Use split()'
      ],
      correctAnswer: 0,
      explanation: 'Regex \\d+ matches only numeric characters.',
      category: 'easy'
    },
    {
      id: 'se-60',
      question: 'Count capital and small letters in a string.',
      options: [
        'Loop and compare charCode ranges',
        'Use sort()',
        'Use split() only',
        'Use trim()'
      ],
      correctAnswer: 0,
      explanation: 'Character code comparison identifies uppercase vs lowercase letters.',
      category: 'easy'
    },
    {
      id: 'se-61',
      question: 'Given an array of integers, find the length of the longest subarray with sum equal to 0.',
      options: ['Use prefix sum and hash map', 'Use sorting', 'Use two pointers', 'Use binary search'],
      correctAnswer: 0,
      explanation: 'You can store prefix sums in a hash map and track when the same sum repeats, indicating a zero-sum subarray.',
      category: 'medium'
    },
    {
      id: 'se-62',
      question: 'Find the majority element in an array (appears more than n/2 times).',
      options: ['Sorting', 'Hash map counting', 'Boyer-Moore Voting Algorithm', 'Binary search'],
      correctAnswer: 2,
      explanation: 'Boyer–Moore algorithm efficiently finds the majority element in O(n) time and O(1) space.',
      category: 'medium'
    },
    {
      id: 'se-63',
      question: 'Given a string, find the longest substring without repeating characters.',
      options: ['Two-pointer sliding window', 'Recursion', 'Sorting', 'Stack'],
      correctAnswer: 0,
      explanation: 'A sliding window and hash set can track characters for O(n) time complexity.',
      category: 'medium'
    },
    {
      id: 'se-64',
      question: 'Given an array, rotate it to the right by k steps.',
      options: ['Reverse approach', 'Bubble rotate', 'Stack', 'Sort then shift'],
      correctAnswer: 0,
      explanation: 'Reverse entire array, then reverse first k and remaining n−k separately to achieve rotation efficiently.',
      category: 'medium'
    },
    {
      id: 'se-65',
      question: 'Given two sorted arrays, find the median of the combined sorted array.',
      options: ['Merge both arrays then find median', 'Binary search on smaller array', 'Prefix sum', 'Heap sort'],
      correctAnswer: 1,
      explanation: 'Binary search on the smaller array finds median efficiently in O(log(min(n,m))) time.',
      category: 'medium'
    },
    {
      id: 'se-66',
      question: 'Find the intersection of two linked lists.',
      options: ['Use hash set', 'Use recursion', 'Use stack', 'Use difference in lengths'],
      correctAnswer: 3,
      explanation: 'Align both lists by length difference and move both pointers one step at a time to find intersection.',
      category: 'medium'
    },
    {
      id: 'se-67',
      question: 'Find the maximum sum subarray of size k.',
      options: ['Kadane’s algorithm', 'Sliding window', 'Sorting', 'Prefix sum'],
      correctAnswer: 1,
      explanation: 'A sliding window efficiently computes sum of each window in O(n).',
      category: 'medium'
    },
    {
      id: 'se-68',
      question: 'Implement an LRU (Least Recently Used) Cache.',
      options: ['LinkedHashMap', 'Deque + HashMap', 'Stack', 'Queue'],
      correctAnswer: 1,
      explanation: 'LRU cache can be implemented using HashMap for O(1) lookups and a doubly linked list for order tracking.',
      category: 'medium'
    },
    {
      id: 'se-69',
      question: 'Find all permutations of a given string.',
      options: ['Recursion with swapping', 'Sorting', 'Hash map', 'Binary search'],
      correctAnswer: 0,
      explanation: 'Use recursion and swap characters to generate all permutations (O(n!)).',
      category: 'medium'
    },
    {
      id: 'se-70',
      question: 'Find the next greater element for each element in an array.',
      options: ['Use stack', 'Use queue', 'Use recursion', 'Use heap'],
      correctAnswer: 0,
      explanation: 'Stack efficiently tracks next greater elements in O(n) time.',
      category: 'medium'
    },
    {
      id: 'se-71',
      question: 'Given an array, find the maximum product subarray.',
      options: ['Dynamic programming', 'Kadane’s variant', 'Sorting', 'Binary search'],
      correctAnswer: 1,
      explanation: 'Track max and min products at each step because negatives can flip signs.',
      category: 'medium'
    },
    {
      id: 'se-72',
      question: 'Find the first missing positive integer in an unsorted array.',
      options: ['Use in-place marking', 'Sorting', 'Hash set', 'Queue'],
      correctAnswer: 0,
      explanation: 'Use index marking (O(n) time, O(1) space) to track presence of numbers 1..n.',
      category: 'medium'
    },
    {
      id: 'se-73',
      question: 'Given a matrix, rotate it 90 degrees clockwise in place.',
      options: ['Transpose + reverse rows', 'Reverse + transpose', 'Sorting', 'Stack'],
      correctAnswer: 0,
      explanation: 'Transpose matrix then reverse each row for clockwise rotation.',
      category: 'medium'
    },
    {
      id: 'se-74',
      question: 'Detect a cycle in a linked list.',
      options: ['Floyd’s cycle detection', 'HashMap', 'Recursion', 'Counting nodes'],
      correctAnswer: 0,
      explanation: 'Use slow and fast pointers to detect cycle efficiently in O(n).',
      category: 'medium'
    },
    {
      id: 'se-75',
      question: 'Given two strings, check if one is a rotation of the other.',
      options: ['Concatenate first string twice and check substring', 'Sorting', 'Hashing', 'Stack'],
      correctAnswer: 0,
      explanation: 'If s2 is in s1+s1, then s2 is a rotation of s1.',
      category: 'medium'
    },
    {
      id: 'se-76',
      question: 'Group anagrams from a list of strings.',
      options: ['Sort each word and use hash map', 'Compare pairwise', 'Use stack', 'Recursion'],
      correctAnswer: 0,
      explanation: 'Use sorted string as a hash key to group anagrams efficiently.',
      category: 'medium'
    },
    {
      id: 'se-77',
      question: 'Find all triplets in an array that sum to zero.',
      options: ['Sorting + two pointers', 'Hash map', 'Brute force', 'Stack'],
      correctAnswer: 0,
      explanation: 'Sort the array, then fix one element and use two-pointer technique to find pairs.',
      category: 'medium'
    },
    {
      id: 'se-78',
      question: 'Find the longest common subsequence between two strings.',
      options: ['Dynamic programming', 'Recursion', 'Greedy', 'Sorting'],
      correctAnswer: 0,
      explanation: 'DP solution stores results of subproblems to compute LCS in O(n*m).',
      category: 'medium'
    },
    {
      id: 'se-79',
      question: 'Count number of islands in a binary matrix.',
      options: ['DFS or BFS traversal', 'Sorting', 'Stack', 'Binary search'],
      correctAnswer: 0,
      explanation: 'Traverse the matrix and use DFS/BFS to mark connected land cells.',
      category: 'medium'
    },
    {
      id: 'se-80',
      question: 'Implement a stack using two queues.',
      options: ['Push costly', 'Pop costly', 'Both are O(1)', 'Use recursion'],
      correctAnswer: 0,
      explanation: 'Use one queue for push and another to reverse order for pop operation.',
      category: 'medium'
    },
    {
      id: 'se-81',
      question: 'Find the minimum window substring containing all characters of another string.',
      options: ['Sliding window + frequency map', 'Sorting', 'Stack', 'Recursion'],
      correctAnswer: 0,
      explanation: 'Use sliding window and hash maps to track character frequencies.',
      category: 'medium'
    },
    {
      id: 'se-82',
      question: 'Find the maximum depth of a binary tree.',
      options: ['Recursion', 'Iterative BFS', 'Dynamic programming', 'Sorting'],
      correctAnswer: 0,
      explanation: 'Depth = 1 + max(left depth, right depth).',
      category: 'medium'
    },
    {
      id: 'se-83',
      question: 'Implement a function to check if a binary tree is balanced.',
      options: ['Recursion with height check', 'BFS', 'Inorder traversal', 'Stack'],
      correctAnswer: 0,
      explanation: 'Check balance recursively while calculating subtree heights.',
      category: 'medium'
    },
    {
      id: 'se-84',
      question: 'Given a binary tree, print its zigzag level order traversal.',
      options: ['BFS with direction flag', 'Recursion', 'Stack only', 'Preorder traversal'],
      correctAnswer: 0,
      explanation: 'Perform BFS but reverse order on every alternate level.',
      category: 'medium'
    },
    {
      id: 'se-85',
      question: 'Find the diameter of a binary tree.',
      options: ['DFS with height tracking', 'BFS', 'Dynamic programming', 'Inorder traversal'],
      correctAnswer: 0,
      explanation: 'At each node, track left and right heights; update max diameter.',
      category: 'medium'
    },
    {
      id: 'se-86',
      question: 'Given an array of intervals, merge overlapping intervals.',
      options: ['Sort and merge sequentially', 'Heap', 'Hashing', 'Recursion'],
      correctAnswer: 0,
      explanation: 'Sort by start time, then merge overlapping intervals iteratively.',
      category: 'medium'
    },
    {
      id: 'se-87',
      question: 'Find the shortest path in a grid with obstacles.',
      options: ['BFS traversal', 'DFS', 'Dijkstra', 'Greedy'],
      correctAnswer: 0,
      explanation: 'Use BFS since all edges have equal weight.',
      category: 'medium'
    },
    {
      id: 'se-88',
      question: 'Implement a function to validate a Sudoku board.',
      options: ['Check rows, columns, subgrids with hash sets', 'Sorting', 'Recursion', 'Backtracking'],
      correctAnswer: 0,
      explanation: 'Ensure no duplicate numbers exist in any row, column, or 3x3 subgrid.',
      category: 'medium'
    },
    {
      id: 'se-89',
      question: 'Find all paths from top-left to bottom-right in a grid with obstacles.',
      options: ['Backtracking', 'Dynamic programming', 'DFS', 'BFS'],
      correctAnswer: 0,
      explanation: 'Use recursive backtracking to explore all valid paths.',
      category: 'medium'
    },
    {
      id: 'se-90',
      question: 'Implement a Trie (prefix tree).',
      options: ['Use nested hash maps', 'Use linked list', 'Use queue', 'Use stack'],
      correctAnswer: 0,
      explanation: 'Each node stores children in a hash map for O(length of word) operations.',
      category: 'medium'
    },
    {
      id: 'se-91',
      question: 'Given a list of words, find all word squares (each row and column form the same word).',
      options: ['Trie + backtracking', 'Sorting', 'DP', 'Stack'],
      correctAnswer: 0,
      explanation: 'Use Trie to efficiently find prefix matches while backtracking through possible combinations.',
      category: 'hard'
    },
    {
      id: 'se-92',
      question: 'Implement a function to solve the N-Queens problem.',
      options: ['Backtracking', 'Greedy', 'Dynamic programming', 'DFS'],
      correctAnswer: 0,
      explanation: 'Use backtracking to try placing queens row by row ensuring no conflicts in columns or diagonals.',
      category: 'hard'
    },
    {
      id: 'se-93',
      question: 'Find all possible subsets of a set of integers (power set).',
      options: ['Recursion + backtracking', 'Sorting', 'Stack', 'Greedy'],
      correctAnswer: 0,
      explanation: 'Use recursion to include or exclude each element forming 2^n subsets.',
      category: 'hard'
    },
    {
      id: 'se-94',
      question: 'Given a 2D board and a list of words, find all words present in the board.',
      options: ['Trie + DFS', 'Sorting', 'Hashing', 'BFS'],
      correctAnswer: 0,
      explanation: 'Use Trie for efficient prefix search and DFS to explore possible letter paths.',
      category: 'hard'
    },
    {
      id: 'se-95',
      question: 'Find the longest increasing path in a matrix.',
      options: ['DFS + memoization', 'DP only', 'BFS', 'Greedy'],
      correctAnswer: 0,
      explanation: 'Use DFS with memoization to store the longest path starting at each cell.',
      category: 'hard'
    },
    {
      id: 'se-96',
      question: 'Implement a function to solve Sudoku.',
      options: ['Backtracking', 'Greedy', 'Recursion', 'Dynamic programming'],
      correctAnswer: 0,
      explanation: 'Backtracking checks valid placements for each empty cell until the board is complete.',
      category: 'hard'
    },
    {
      id: 'se-97',
      question: 'Given n jobs with deadlines and profits, schedule jobs to maximize total profit.',
      options: ['Greedy + sorting by profit', 'Dynamic programming', 'Stack', 'BFS'],
      correctAnswer: 0,
      explanation: 'Sort jobs by descending profit and place them in available slots before their deadlines.',
      category: 'hard'
    },
    {
      id: 'se-98',
      question: 'Implement a function to find the shortest path in a weighted graph.',
      options: ['Dijkstra’s algorithm', 'BFS', 'DFS', 'Greedy'],
      correctAnswer: 0,
      explanation: 'Dijkstra’s algorithm finds the shortest path in graphs with non-negative edge weights.',
      category: 'hard'
    },
    {
      id: 'se-99',
      question: 'Implement a function to find bridges in an undirected graph.',
      options: ['DFS + discovery time', 'BFS', 'Union-Find', 'DP'],
      correctAnswer: 0,
      explanation: 'Use DFS and record discovery and low times to detect edges whose removal disconnects graph.',
      category: 'hard'
    },
    {
      id: 'se-100',
      question: 'Find strongly connected components in a directed graph.',
      options: ['Kosaraju’s algorithm', 'BFS', 'DFS', 'Prim’s algorithm'],
      correctAnswer: 0,
      explanation: 'Kosaraju’s algorithm uses two DFS passes to group strongly connected components.',
      category: 'hard'
    },
    {
      id: 'se-101',
      question: 'Implement a function to detect and remove a loop in a linked list.',
      options: ['Floyd’s algorithm + pointer reset', 'Stack', 'Hashing', 'Recursion'],
      correctAnswer: 0,
      explanation: 'Detect the loop with Floyd’s algorithm, then reset one pointer to head and move both until meeting point.',
      category: 'hard'
    },
    {
      id: 'se-102',
      question: 'Given a binary tree, flatten it into a linked list in-place.',
      options: ['Postorder traversal', 'Preorder traversal + stack', 'Level order', 'DFS'],
      correctAnswer: 1,
      explanation: 'Preorder traversal ensures correct order while re-linking right pointers.',
      category: 'hard'
    },
    {
      id: 'se-103',
      question: 'Find the kth smallest element in a binary search tree.',
      options: ['Inorder traversal', 'Level order', 'Preorder', 'DFS'],
      correctAnswer: 0,
      explanation: 'Inorder traversal of BST gives sorted order, so count nodes until kth element.',
      category: 'hard'
    },
    {
      id: 'se-104',
      question: 'Implement a function to serialize and deserialize a binary tree.',
      options: ['Preorder + null markers', 'Inorder only', 'Postorder', 'Level order only'],
      correctAnswer: 0,
      explanation: 'Preorder traversal with markers for null allows full reconstruction of tree.',
      category: 'hard'
    },
    {
      id: 'se-105',
      question: 'Find the maximum path sum in a binary tree.',
      options: ['DFS recursion', 'BFS', 'Dynamic programming', 'Sorting'],
      correctAnswer: 0,
      explanation: 'At each node, compute maximum gain from left and right subtrees and update global max.',
      category: 'hard'
    },
    {
      id: 'se-106',
      question: 'Implement a function to find the longest palindromic substring in a string.',
      options: ['Expand around center', 'Dynamic programming', 'Recursion', 'Stack'],
      correctAnswer: 0,
      explanation: 'Expand around each character to find longest palindrome in O(n²) time.',
      category: 'hard'
    },
    {
      id: 'se-107',
      question: 'Given a string, find the minimum number of cuts to make all substrings palindromes.',
      options: ['Dynamic programming', 'Recursion', 'Greedy', 'Stack'],
      correctAnswer: 0,
      explanation: 'DP stores minimum cuts for each prefix and checks palindrome substrings.',
      category: 'hard'
    },
    {
      id: 'se-108',
      question: 'Find all possible combinations that sum up to a target number (unlimited reuse).',
      options: ['Backtracking', 'DP', 'Greedy', 'Sorting'],
      correctAnswer: 0,
      explanation: 'Use recursive backtracking to try including each element multiple times.',
      category: 'hard'
    },
    {
      id: 'se-109',
      question: 'Find all combinations of k numbers that sum up to n.',
      options: ['Backtracking', 'Dynamic programming', 'Recursion', 'Stack'],
      correctAnswer: 0,
      explanation: 'Backtrack by choosing numbers and adjusting remaining target until k elements used.',
      category: 'hard'
    },
    {
      id: 'se-110',
      question: 'Implement a graph coloring algorithm using backtracking.',
      options: ['Try all color assignments', 'Greedy', 'DFS only', 'Union-Find'],
      correctAnswer: 0,
      explanation: 'Assign colors to vertices ensuring no two adjacent vertices share same color.',
      category: 'hard'
    },
    {
      id: 'se-111',
      question: 'Implement a Union-Find (Disjoint Set Union) data structure with path compression.',
      options: ['Parent array + rank', 'Hash map', 'Adjacency matrix', 'Stack'],
      correctAnswer: 0,
      explanation: 'Store parent and rank; path compression optimizes find operation.',
      category: 'hard'
    },
    {
      id: 'se-112',
      question: 'Given an array of integers, find the longest consecutive sequence.',
      options: ['Hash set', 'Sorting', 'Dynamic programming', 'Stack'],
      correctAnswer: 0,
      explanation: 'Hash set allows checking consecutive elements in O(n) time.',
      category: 'hard'
    },
    {
      id: 'se-113',
      question: 'Find the minimum number of coins required to make a given amount.',
      options: ['Dynamic programming', 'Greedy', 'Recursion', 'Sorting'],
      correctAnswer: 0,
      explanation: 'DP stores minimum coins needed for each total up to target.',
      category: 'hard'
    },
    {
      id: 'se-114',
      question: 'Implement a word ladder transformation (shortest transformation from start to end word).',
      options: ['BFS + word mutation', 'DFS', 'DP', 'Sorting'],
      correctAnswer: 0,
      explanation: 'Use BFS to ensure shortest transformation between valid words.',
      category: 'hard'
    },
    {
      id: 'se-115',
      question: 'Find the minimum spanning tree of a graph.',
      options: ['Kruskal’s algorithm', 'BFS', 'DFS', 'Dijkstra'],
      correctAnswer: 0,
      explanation: 'Kruskal’s algorithm sorts edges and uses union-find to form MST.',
      category: 'hard'
    },
    {
      id: 'se-116',
      question: 'Find the maximum flow in a network.',
      options: ['Ford–Fulkerson algorithm', 'Dijkstra', 'BFS', 'Bellman-Ford'],
      correctAnswer: 0,
      explanation: 'Ford–Fulkerson finds augmenting paths and updates residual capacities.',
      category: 'hard'
    },
    {
      id: 'se-117',
      question: 'Implement topological sorting of a directed acyclic graph.',
      options: ['DFS or Kahn’s algorithm', 'BFS only', 'Union-Find', 'Recursion'],
      correctAnswer: 0,
      explanation: 'Kahn’s algorithm uses indegree array and queue for O(V+E) sorting.',
      category: 'hard'
    },
    {
      id: 'se-118',
      question: 'Find the longest increasing subsequence in an array.',
      options: ['Dynamic programming', 'Sorting', 'Binary search', 'Greedy'],
      correctAnswer: 0,
      explanation: 'DP approach compares each pair of elements for longest increasing pattern.',
      category: 'hard'
    },
    {
      id: 'se-119',
      question: 'Solve the Traveling Salesman Problem (TSP).',
      options: ['Dynamic programming with bitmask', 'Greedy', 'DFS', 'BFS'],
      correctAnswer: 0,
      explanation: 'Use bitmask DP to record visited cities and minimize total path cost.',
      category: 'hard'
    },
    {
      id: 'se-120',
      question: 'Find the kth largest element in an unsorted array.',
      options: ['Quickselect', 'Heap', 'Sorting', 'Binary search'],
      correctAnswer: 0,
      explanation: 'Quickselect is a partial quicksort that finds kth element in average O(n).',
      category: 'hard'
    },
    {
      id: 'se-a1',
      question: 'Implement an LRU (Least Recently Used) Cache.',
      options: [
        'Use a linked list and hash map combination',
        'Use a stack for tracking usage',
        'Use a queue to store recent elements',
        'Sort elements by frequency each time'
      ],
      correctAnswer: 0,
      explanation: 'An LRU cache uses a doubly linked list to maintain order and a hash map for O(1) lookups and updates.',
      category: 'advanced'
    },
    {
      id: 'se-a2',
      question: 'Design a system that can handle millions of URL shortening requests (like bit.ly).',
      options: [
        'Use hashing, database sharding, and load balancers',
        'Store URLs in a text file',
        'Use one central server for all requests',
        'Store URLs in an array'
      ],
      correctAnswer: 0,
      explanation: 'A scalable URL shortener uses hash-based ID generation, distributed databases, and load balancing.',
      category: 'advanced'
    },
    {
      id: 'se-a3',
      question: 'Find the median of two sorted arrays of different sizes.',
      options: [
        'Use binary search on the smaller array',
        'Merge both arrays and find the middle element',
        'Sort both arrays and average the medians',
        'Use recursion on both arrays'
      ],
      correctAnswer: 0,
      explanation: 'Binary search on the smaller array partitions both arrays in O(log(min(n,m))) time.',
      category: 'advanced'
    },
    {
      id: 'se-a4',
      question: 'Implement a Trie (Prefix Tree) for autocomplete suggestions.',
      options: [
        'Use nested hash maps to represent nodes',
        'Use arrays for all words',
        'Use binary search for word lookup',
        'Use linked list for each prefix'
      ],
      correctAnswer: 0,
      explanation: 'A Trie stores each word character by character using hash maps or arrays, enabling fast prefix-based lookups.',
      category: 'advanced'
    },
    {
      id: 'se-a5',
      question: 'Detect and remove a cycle in a linked list.',
      options: [
        'Use Floyd’s Tortoise and Hare algorithm',
        'Sort the list to find duplicates',
        'Reverse the linked list twice',
        'Use recursion to detect cycles'
      ],
      correctAnswer: 0,
      explanation: 'Floyd’s cycle detection algorithm uses two pointers moving at different speeds to detect cycles efficiently.',
      category: 'advanced'
    },
    {
      id: 'se-a6',
      question: 'Serialize and deserialize a binary tree.',
      options: [
        'Use preorder traversal and null markers',
        'Use BFS traversal only',
        'Use inorder traversal only',
        'Store tree as an array'
      ],
      correctAnswer: 0,
      explanation: 'Preorder traversal with null markers ensures correct structure restoration during deserialization.',
      category: 'advanced'
    },
    {
      id: 'se-a7',
      question: 'Find the shortest path in a weighted graph with negative weights.',
      options: [
        'Use Bellman-Ford algorithm',
        'Use Dijkstra’s algorithm',
        'Use BFS traversal',
        'Use DFS traversal'
      ],
      correctAnswer: 0,
      explanation: 'Bellman-Ford works for graphs with negative weights and detects negative cycles.',
      category: 'advanced'
    },
    {
      id: 'se-a8',
      question: 'Implement a thread-safe Singleton design pattern.',
      options: [
        'Use double-checked locking with synchronization',
        'Use static global variable',
        'Use recursion to create instance',
        'Use multiple constructors'
      ],
      correctAnswer: 0,
      explanation: 'Double-checked locking ensures thread safety while avoiding unnecessary synchronization overhead.',
      category: 'advanced'
    },
    {
      id: 'se-a9',
      question: 'Design a rate limiter for an API service.',
      options: [
        'Use token bucket or leaky bucket algorithm',
        'Block all requests after limit',
        'Count total requests manually',
        'Use recursion to control flow'
      ],
      correctAnswer: 0,
      explanation: 'Token and leaky bucket algorithms limit request rates efficiently by allowing bursts up to capacity.',
      category: 'advanced'
    },
    {
      id: 'se-a10',
      question: 'Find the Kth smallest element in a large data stream.',
      options: [
        'Use a max heap of size k',
        'Sort the stream after reading',
        'Store all elements in an array',
        'Use recursion and partition'
      ],
      correctAnswer: 0,
      explanation: 'A max heap of size k maintains the smallest k elements efficiently in O(n log k) time.',
      category: 'advanced'
    },
    {
      id: 'se-a11',
      question: 'Implement topological sorting for a directed acyclic graph (DAG).',
      options: [
        'Use DFS or Kahn’s algorithm',
        'Use BFS on each node separately',
        'Use recursion with backtracking only',
        'Use random ordering of nodes'
      ],
      correctAnswer: 0,
      explanation: 'DFS and Kahn’s algorithm generate a valid topological order by tracking dependencies.',
      category: 'advanced'
    },
    {
      id: 'se-a12',
      question: 'Implement a distributed message queue system like Kafka.',
      options: [
        'Use partitioning, replication, and leader-follower design',
        'Use arrays for storing messages',
        'Use a single-threaded server',
        'Use HTTP polling only'
      ],
      correctAnswer: 0,
      explanation: 'Kafka-style queues use distributed storage, replication, and leader election for reliability and scalability.',
      category: 'advanced'
    },
    {
      id: 'se-a13',
      question: 'Design a database schema for a social media feed.',
      options: [
        'Use user, post, like, and comment tables with foreign keys',
        'Store all data in a single table',
        'Use flat files for posts',
        'Ignore relationships between users'
      ],
      correctAnswer: 0,
      explanation: 'Normalized relational schemas with proper foreign keys efficiently manage relationships like users, posts, and likes.',
      category: 'advanced'
    },
    {
      id: 'se-a14',
      question: 'Implement Dijkstra’s algorithm using a priority queue.',
      options: [
        'Use a min heap for shortest distance tracking',
        'Use an array for all distances',
        'Use recursion to find shortest path',
        'Use DFS traversal'
      ],
      correctAnswer: 0,
      explanation: 'A min heap optimizes Dijkstra’s algorithm to O(E log V) complexity by efficiently finding the smallest distance node.',
      category: 'advanced'
    },
    {
      id: 'se-a15',
      question: 'Build a real-time chat server.',
      options: [
        'Use WebSockets and event-driven architecture',
        'Use HTTP polling',
        'Use email APIs',
        'Use local file storage for messages'
      ],
      correctAnswer: 0,
      explanation: 'WebSockets enable full-duplex communication essential for real-time chat applications.',
      category: 'advanced'
    },
    {
      id: 'se-a16',
      question: 'Implement a max flow algorithm.',
      options: [
        'Use Ford-Fulkerson or Edmonds-Karp algorithm',
        'Use BFS traversal only',
        'Use recursion for all edges',
        'Sort edges and pick maximum'
      ],
      correctAnswer: 0,
      explanation: 'Ford-Fulkerson with BFS-based path finding (Edmonds-Karp) finds the maximum possible flow in a network.',
      category: 'advanced'
    },
    {
      id: 'se-a17',
      question: 'Find articulation points in a graph.',
      options: [
        'Use DFS and track discovery and low times',
        'Use BFS traversal',
        'Use recursion on all edges',
        'Sort edges by weight'
      ],
      correctAnswer: 0,
      explanation: 'Tarjan’s algorithm uses DFS with discovery and low values to identify articulation points.',
      category: 'advanced'
    },
    {
      id: 'se-a18',
      question: 'Implement a memory-efficient Trie for large datasets.',
      options: [
        'Use compressed Trie (Radix Tree)',
        'Use a hash map for each character',
        'Use an array of fixed size',
        'Use recursion for each word'
      ],
      correctAnswer: 0,
      explanation: 'Radix Trees reduce memory by merging single-child paths in the Trie.',
      category: 'advanced'
    },
    {
      id: 'se-a19',
      question: 'Find strongly connected components (SCC) in a graph.',
      options: [
        'Use Kosaraju’s or Tarjan’s algorithm',
        'Use BFS traversal only',
        'Use union-find algorithm',
        'Use topological sort directly'
      ],
      correctAnswer: 0,
      explanation: 'Kosaraju’s and Tarjan’s algorithms efficiently find SCCs using DFS and stack-based processing.',
      category: 'advanced'
    },
    {
      id: 'se-a20',
      question: 'Implement an in-memory key-value store with TTL support.',
      options: [
        'Use hash map with timestamps and background cleanup thread',
        'Use linked list for storage',
        'Use file-based system',
        'Use static array'
      ],
      correctAnswer: 0,
      explanation: 'Storing keys with expiration timestamps and periodic cleanup maintains TTL efficiently.',
      category: 'advanced'
    },
    {
      id: 'se-a21',
      question: 'Design a scalable file storage service like Google Drive.',
      options: [
        'Use distributed file system with metadata servers',
        'Use one database for all files',
        'Store files as text',
        'Use FTP for access'
      ],
      correctAnswer: 0,
      explanation: 'Distributed file systems ensure scalability and reliability with metadata and chunk servers.',
      category: 'advanced'
    },
    {
      id: 'se-a22',
      question: 'Implement KMP (Knuth-Morris-Pratt) string search algorithm.',
      options: [
        'Precompute longest prefix suffix (LPS) array for pattern',
        'Use brute force substring matching',
        'Use sorting to match substrings',
        'Use recursion for search'
      ],
      correctAnswer: 0,
      explanation: 'KMP algorithm avoids re-checking by precomputing the LPS array for pattern prefixes.',
      category: 'advanced'
    },
    {
      id: 'se-a23',
      question: 'Build a distributed caching system like Redis.',
      options: [
        'Use sharding, replication, and in-memory key-value storage',
        'Use disk-based database',
        'Use recursion for cache invalidation',
        'Use static arrays for data'
      ],
      correctAnswer: 0,
      explanation: 'Distributed caching uses in-memory storage and sharding for high-speed lookups and scalability.',
      category: 'advanced'
    },
    {
      id: 'se-a24',
      question: 'Find the shortest common supersequence of two strings.',
      options: [
        'Use dynamic programming based on LCS table',
        'Use recursion only',
        'Concatenate both strings',
        'Use sorting'
      ],
      correctAnswer: 0,
      explanation: 'Dynamic programming using LCS table helps build the shortest common supersequence.',
      category: 'advanced'
    },
    {
      id: 'se-a25',
      question: 'Design a recommendation system for users.',
      options: [
        'Use collaborative filtering or content-based filtering',
        'Sort products by price',
        'Use random suggestions',
        'Use basic keyword search'
      ],
      correctAnswer: 0,
      explanation: 'Recommendation systems use similarity between users or items for personalized results.',
      category: 'advanced'
    },
    {
      id: 'se-a26',
      question: 'Implement a balanced AVL Tree.',
      options: [
        'Perform rotations on insert/delete to maintain height balance',
        'Sort after each insertion',
        'Use queue for balancing',
        'Store nodes in array only'
      ],
      correctAnswer: 0,
      explanation: 'AVL trees perform rotations to keep height difference ≤ 1 after each operation.',
      category: 'advanced'
    },
    {
      id: 'se-a27',
      question: 'Detect deadlocks in a system of processes.',
      options: [
        'Use wait-for graph and cycle detection',
        'Use recursion on all processes',
        'Use random resource allocation',
        'Use queue and stack together'
      ],
      correctAnswer: 0,
      explanation: 'A wait-for graph can identify cycles representing deadlocks among processes.',
      category: 'advanced'
    },
    {
      id: 'se-a28',
      question: 'Find bridges in a graph (edges whose removal increases components).',
      options: [
        'Use DFS with discovery and low values',
        'Use BFS traversal',
        'Sort edges by weight',
        'Use union-find algorithm'
      ],
      correctAnswer: 0,
      explanation: 'Tarjan’s bridge-finding algorithm detects edges whose removal disconnects components.',
      category: 'advanced'
    },
    {
      id: 'se-a29',
      question: 'Implement A* pathfinding algorithm.',
      options: [
        'Use priority queue with heuristic + distance cost',
        'Use BFS traversal only',
        'Use recursion for all paths',
        'Use stack-based traversal'
      ],
      correctAnswer: 0,
      explanation: 'A* uses a heuristic function to prioritize exploration and find the shortest path efficiently.',
      category: 'advanced'
    },
    {
      id: 'se-a30',
      question: 'Design a scalable notification delivery system.',
      options: [
        'Use message queues, worker threads, and push services',
        'Use a loop to send one notification at a time',
        'Use local files for tracking users',
        'Use polling for every request'
      ],
      correctAnswer: 0,
      explanation: 'Scalable notification systems rely on async queues and worker processes to handle high load efficiently.',
      category: 'advanced'
    }
  ]
},
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'User interface development and client-side logic',
    questions: [
      {
        id: 'fe-1',
        question: 'What is the virtual DOM in React?',
        options: [
          'A direct representation of the actual DOM',
          'A lightweight copy of the real DOM',
          'A browser API',
          'A CSS framework'
        ],
        correctAnswer: 1,
        explanation: 'Virtual DOM is a lightweight copy of the real DOM that React uses for performance optimization.',
        category: 'easy'
      },
      {
        id: 'fe-2',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Transfer Markup Language',
          'Hyper Tool Multi Language',
          'Hyperlinks and Text Management Language'
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language and is used to structure web pages.',
        category: 'beginner'
      },
      {
        id: 'fe-3',
        question: 'Which HTML tag is used to create a hyperlink?',
        options: ['<a>', '<link>', '<href>', '<url>'],
        correctAnswer: 0,
        explanation: 'The <a> tag defines a hyperlink that is used to link from one page to another.',
        category: 'beginner'
      },
      {
        id: 'fe-4',
        question: 'What is the purpose of React hooks?',
        options: [
          'To allow functional components to use state and lifecycle features',
          'To connect to external APIs',
          'To style components',
          'To handle routing'
        ],
        correctAnswer: 0,
        explanation: 'React hooks allow functional components to use state, lifecycle methods, and other React features.',
        category: 'medium'
      },
      {
        id: 'fe-5',
        question: 'What is the difference between let and const in JavaScript?',
        options: [
          'let allows reassignment, const does not',
          'const allows reassignment, let does not',
          'Both are the same',
          'let is for functions, const is for variables'
        ],
        correctAnswer: 0,
        explanation: 'let allows variable reassignment, while const creates a read-only reference to a value.',
        category: 'easy'
      },
      {
        id: 'fe-6',
        question: 'What is Webpack mainly used for?',
        options: [
          'Module bundling and asset optimization',
          'State management',
          'API testing',
          'Database management'
        ],
        correctAnswer: 0,
        explanation: 'Webpack is a module bundler that processes and optimizes assets for web applications.',
        category: 'hard'
      },
    ]
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    description: 'Server-side development, APIs, databases, and backend architecture',
    questions: [
      {
        id: 'be-1',
        question: 'What is the main purpose of a backend in web development?',
        options: [
          'To handle database and server logic',
          'To design the user interface',
          'To add animations to a website',
          'To manage browser storage'
        ],
        correctAnswer: 0,
        explanation: 'The backend handles database interactions, server logic, and communication with the frontend.',
        category: 'beginner'
      },
      {
        id: 'be-2',
        question: 'What is Node.js mainly used for?',
        options: [
          'Building client-side animations',
          'Server-side JavaScript execution',
          'Styling web pages',
          'Running SQL queries directly in the browser'
        ],
        correctAnswer: 1,
        explanation: 'Node.js allows JavaScript to run on the server for backend development.',
        category: 'easy'
      },
      {
        id: 'be-3',
        question: 'Which module in Node.js is used to create a server?',
        options: ['fs', 'http', 'url', 'path'],
        correctAnswer: 1,
        explanation: 'The built-in "http" module is used to create and manage HTTP servers in Node.js.',
        category: 'easy'
      },
      {
        id: 'be-4',
        question: 'What is database indexing?',
        options: [
          'A data structure to improve query performance',
          'A way to backup databases',
          'A method for data encryption',
          'A type of database relationship'
        ],
        correctAnswer: 0,
        explanation: 'Database indexing creates a data structure that improves the speed of data retrieval operations.',
        category: 'medium'
      },
      {
        id: 'be-5',
        question: 'What is the purpose of JWT in authentication?',
        options: [
          'To securely transmit information between parties as JSON objects',
          'To style web pages',
          'To manage database connections',
          'To handle file uploads'
        ],
        correctAnswer: 0,
        explanation: 'JWT (JSON Web Token) is used for securely transmitting information between parties as a JSON object.',
        category: 'medium'
      },
      {
        id: 'be-6',
        question: 'What is database sharding?',
        options: [
          'Partitioning data across multiple databases',
          'Backing up database files',
          'Encrypting database contents',
          'Compressing database size'
        ],
        correctAnswer: 0,
        explanation: 'Sharding is a database architecture pattern that partitions data across multiple databases to improve performance and scalability.',
        category: 'hard'
      },
    ]
  },
  {
    id: 'full-stack-developer',
    name: 'Full Stack Developer',
    description: 'Covers frontend, backend, database, and system design concepts for full stack interviews',
    questions: [
      {
        id: 'fs-1',
        question: 'What is the virtual DOM in React?',
        options: [
          'A direct representation of the actual DOM',
          'A lightweight copy of the real DOM',
          'A browser API',
          'A CSS framework'
        ],
        correctAnswer: 1,
        explanation: 'Virtual DOM is a lightweight copy of the real DOM that React uses to efficiently update the UI.',
        category: 'easy'
      },
      {
        id: 'fs-2',
        question: 'What is JSX in React?',
        options: [
          'A CSS preprocessor',
          'A syntax extension for JavaScript',
          'A testing library',
          'A JSON format'
        ],
        correctAnswer: 1,
        explanation: 'JSX stands for JavaScript XML, allowing you to write HTML-like syntax inside JavaScript.',
        category: 'easy'
      },
      {
        id: 'fs-3',
        question: 'What is the difference between state and props in React?',
        options: [
          'Props are mutable, state is immutable',
          'State is mutable, props are immutable',
          'Both are immutable',
          'Both are mutable'
        ],
        correctAnswer: 1,
        explanation: 'State can be changed within a component, while props are read-only and passed from parent to child.',
        category: 'medium'
      },
      {
        id: 'fs-4',
        question: 'What is the purpose of middleware in Express.js?',
        options: [
          'To handle requests and responses in the application',
          'To style the application',
          'To manage client-side state',
          'To create database schemas'
        ],
        correctAnswer: 0,
        explanation: 'Middleware functions in Express.js have access to request and response objects and can perform tasks, modify requests, or end the request-response cycle.',
        category: 'medium'
      },
      {
        id: 'fs-5',
        question: 'What is the principle of least privilege in security?',
        options: [
          'Users should have only the permissions they need to perform their tasks',
          'All users should have admin access',
          'Passwords should be simple and easy to remember',
          'Security should be implemented only at the network level'
        ],
        correctAnswer: 0,
        explanation: 'The principle of least privilege states that users and systems should have only the minimum permissions necessary to perform their required functions.',
        category: 'hard'
      },
      {
        id: 'fs-6',
        question: 'What is the difference between microservices and monolithic architecture?',
        options: [
          'Microservices split applications into smaller, independent services',
          'Microservices are faster than monolithic architecture',
          'Monolithic architecture is always better for large applications',
          'There is no significant difference'
        ],
        correctAnswer: 0,
        explanation: 'Microservices architecture breaks down applications into smaller, independently deployable services, while monolithic architecture keeps all components in a single codebase.',
        category: 'advanced'
      },
    ]
  },
];

export const defaultQuizConfigs = [
  { duration: 5, questionCount: 10, label: '5 min - 10 questions' },
  { duration: 10, questionCount: 15, label: '10 min - 15 questions' },
  { duration: 15, questionCount: 20, label: '20 min - 20 questions' },
];

// Add this new export for question categories
export const questionCategories = [
  { id: 'beginner', name: 'Beginner', description: 'Basic concepts and fundamentals' },
  { id: 'easy', name: 'Easy', description: 'Simple problems and basic concepts' },
  { id: 'medium', name: 'Medium', description: 'Moderate difficulty with practical applications' },
  { id: 'hard', name: 'Hard', description: 'Complex problems requiring deep understanding' },
  { id: 'advanced', name: 'Advanced', description: 'Expert-level concepts and system design' },
];