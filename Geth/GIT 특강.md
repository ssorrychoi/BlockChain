20190829

## Git 특강

- Python 설치
- https://www.python.org/downloads/
- phthon 3.7.4
- Linus Tovalds



## GitHub

- 저장소로써의 Github 보다는 협업으로써의 Github
- Git으로 협업할땐 민주주의가 아닌 권위주의로 시작함.
- Push/Pull을 할땐 권위주의적.



## GIT 명령어

- `git diff`

  `git add` 를 하기 전에 어떤부분이 바뀌었는지 자세히 볼 수 있는 명령어이다.

- `git checkout (commit Hash)` / `git checkout master`

  branch를 바꿀 수 있는 명령어이다. hash값을 넣어도 바뀌고 branch의 이름을 넣어도 가능하다.

- `git log --oneline`

  지금 까지 변경된 부분을 한줄로 간단히 볼 수 있음

- `git branch [branch이름]`

  branch를 새로 생성할 때 사용되는 명령어

  **Branch는 급하게 자주 만들것을 추천!**

- `git log --oneline --graph`

  지금까지 변경된 부분을 그래프로 보여주는 명령어

- `git log --oneline --pretty=format: "%h %s" --graph `

- `git merge [branch name]`

  branch와 master를 합칠때 사용하는 명령어

- `git push origin master`

  ***origin*** - 원격저장소 이름, ***master*** - 브랜치 이름



## 끝말잇기 <팀장>역할

- `mkdir ggutmal`

- `cd ggutmal`

- `code .` =>visual code 실행명령어

- `README.md` 파일 생성

  ```
  # 끝말잇기
  git을 통한 협업 프로젝트
  
  ## 협업시작
  부하는 들어라. 내가 쓰는 단어로부터 끝말잇기를 시작하라.
  ```

- `git init` -> git을 시작할때 명령어

- `git status`  -> 상태확인

- Git은 3영역으로 분리됨

  - Working Directory
  - Staging Area (Index)
  - Commit (log)

- 1. `git add README.md`

- 2. `git commit -m "first commit"`

- 3. `git log`   => Hash값이 나온다.

##### git의 관리구조는 블록체인과 동일하다!

- `git log --oneline` =>짤막한 로그를 볼 수 있다.
- `git remote -v`
- `git remote add origin https://---`
- `git push -u origin master`



## 끝말잇기 <팀원>역할

- `clone` 명령을 통해서 가져온다.
- `git clone https://---`
- 코드 수정
- `git add .`
- `git commit -m "2nd commit"`
- `git push origin master`



## 다시 <팀장> 역할

- `git pull origin master`



## Push/Pull 프로젝트로 깨닳은점

- **동시에 작업**이 불가능
- 커뮤니케이션의 중요성



## pull request

![image](https://user-images.githubusercontent.com/43080040/63910724-daebc100-ca62-11e9-9360-fdbce5969333.png)

- pull request는 남의 Repository를 내가 Fork해온 후 `내가 fork해온 소스 + 내소스`해서 repository에게 요청을 하는 것



## Visual Git (git 시각화)

- https://git-school.github.io/visualizing-git/a