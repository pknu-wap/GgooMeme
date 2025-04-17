# 프로젝트 개요 🔎
대용량 데이터를 고려한 디자인 템플릿 검색 사이트


# 프로젝트 참여자 🖥
|Backend|Backend|Backend|Backend|Frontend|
|:-----:|:-----:|:-----:|:-----:|:-----:|
|<a href="https://github.com/Zepelown"><img src="https://avatars.githubusercontent.com/u/49135677?v=4" width="128" height="128"></a>|<a href="https://github.com/FhRh"><img src="https://avatars.githubusercontent.com/u/48638700?v=4" width="128" height="128"></a>|<a href="https://github.com/chaerin05"><img src="https://avatars.githubusercontent.com/u/163750775?v=4" width="128" height="128"></a>|<a href="https://github.com/skadjs"><img src="https://avatars.githubusercontent.com/u/143885031?v=4" width="128" height="128"></a>|<a href="https://github.com/YJeongs"><img src="https://avatars.githubusercontent.com/u/112613300?v=4" width="128" height="128"></a>
|[윤성원](https://github.com/Zepelown)| [양두영](https://github.com/FhRh)|  [이채린](https://github.com/chaerin05)| [김남언](https://github.com/skadjs)| [하윤정](https://github.com/YJeongs)|

# 프로젝트 사용 기술
## Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## Backend
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
<img src="https://img.shields.io/badge/apachejmeter-D22128?style=for-the-badge&logo=apachejmeter&logoColor=white"> 
<img src="https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white"> 
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 

# 구조도
![image](https://github.com/user-attachments/assets/4c2c9059-edf0-4ceb-a5a9-a6b8c048a515)

- AWS의 LoadBalancer를 사용하여 2대의 인스턴스에 트래픽을 분산시킴
- 특정 api의 데이터 접근로에 레디스를 활용한 캐싱 적용
- 한 서버에서 2개의 DB에 접근하여 데이터 관리 안정성 및 효율성 증가

