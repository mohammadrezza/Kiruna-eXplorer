SECOND RETROSPECTIVE (Team 11)
=====================================

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done 

  3/3
- Total points committed vs. done 

  12/12
- Nr of hours planned vs. spent (as a team)

  100/100

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|-------|---------|--------|------------|--------------|
| _#0_  |    22    |        |    54    |     56    |
| _#4_  |   14 |    5  |    23  |   21   |
| _#5_  |   3  |   5  |     6   |  6      |
| _#6_  |    8   |  2    |    17     |     17      |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

 average estimate: 2.13 h

 average actual: 2.13 h

 standard deviation estimate: 1.41 h

 standard deviation actual: 1.48 h

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

    res: 0

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    res: 0,068

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 22
  - Total hours spent: 21
  - Nr of automated unit test cases : 76
  - Coverage (if available): 72.5%
- E2E testing:
  - Total hours estimated: 4
  - Total hours spent: 4
- Code review 
  - Total hours estimated: 12
  - Total hours spent: 12
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

We made errors in estimating the effort required for the testing tasks; some were underestimated, while others were overestimated. This was due to it being our first time focusing on them in depth.
 Similarly, we underestimated the effort needed to dockerize the project because we had not fully reviewed the directives from the beginning.
  

- What lessons did you learn (both positive and negative) in this sprint?

Positive:
We learned that dividing tasks into distinct categories, such as bug fixing, testing, and review, helps in better time management and organization.

Negative:
We realized that having more frequent meetings during the sprint is more effective than relying on a single extensive meeting before the demo.


  
- Which improvement goals set in the previous retrospective were you able to achieve?

We partially achieved our goal, as we focused more on addressing the constraints. We believe there is still room for improvement in the next sprint.

- Which ones you were not able to achieve? Why?

The part of the goal that requires more attention is our focus on details. For example, the database was populated in a slightly different way, which led to misunderstandings. We should have relied more on the documentation from the very beginning of the sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

We should communicate more throughout the sprint by planning additional meetings to test the website and holding pair-programming sessions. This will help ensure that everyone on the team has a better understanding of how the system works.

- One thing you are proud of as a Team!!

As a team, we are proud of maintaining a steady number of stories delivered, ensuring good test coverage, and, overall, accurately estimating the duration of tasks.







