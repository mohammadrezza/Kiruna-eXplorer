TEMPLATE FOR RETROSPECTIVE (Team 11)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done 

  3/3
- Total points committed vs. done 

  9/9
- Nr of hours planned vs. spent (as a team)

  96.39/97.25

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|-------|---------|--------|------------|--------------|
| _#0_  |    9    |        |     42   |    40.30      |
| _#1_  |   8 |    2  |    24.30  |   24.50   |
| _#2_  |   6  |   5  |     23.30   |  24.05      |
| _#3_  |    3   |  2    |    8     |     8h      |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

 average estimate: (/)= 3.71

 average actual: (/)= 3.74

 standard deviation estimate: 3.75

 standard deviation actual: 3.85

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

    res: -0,0088

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    res: 0,047

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 8
  - Total hours spent: 8
  - Nr of automated unit test cases : 6
  - Coverage (if available): 31.5%
- E2E testing:
  - Total hours estimated: 3
  - Total hours spent: 3
- Code review 
  - Total hours estimated: 3
  - Total hours spent: 3
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

Given the underestimation errors, we hadn’t allocated any time for bug fixing, so resolving issues ended up taking longer than anticipated. 
  

- What lessons did you learn (both positive and negative) in this sprint?

We learned that effective coordination helped us complete the project on time, and that having different people perform the same test allowed us to evaluate various aspects of the task.

One challenge is that, with our language barriers, when explanations aren’t clear, we should provide more examples to enhance understanding.

  
- Which improvement goals set in the previous retrospective were you able to achieve?

We reached our goal: we did the testing and we did create documentation (postman) beforse starting everything  
  
- Which ones you were not able to achieve? Why?

We did achieve both

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

We should pay closer attention to detail and continuously check constraints, not just at the beginning.


- One thing you are proud of as a Team!!

We as a team are proud that our group collaborated so effectively: whenever someone encountered a problem, there was always someone else ready to step in and offer support. 
