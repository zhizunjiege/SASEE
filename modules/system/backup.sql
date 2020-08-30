-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: app
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `app`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `app` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `app`;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gender` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `priv` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tel` char(16) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'陈婷','女','benke03','94e5234a22ecc663fc508fdcd9aa8cac','root','benke03@163.com',NULL),(2,'陈智杰','男','jason','5c3822912406cdb5e7c39580a18cf2bc','root','2452816044@qq.com',NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bysj`
--

DROP TABLE IF EXISTS `bysj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bysj` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacher` int(10) unsigned NOT NULL,
  `student` int(10) unsigned DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `source` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `difficulty` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `weight` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ability` json NOT NULL,
  `requirement` varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `introduction` varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `materials` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `studentFiles` json DEFAULT NULL,
  `teacherFiles` json DEFAULT NULL,
  `notice` json DEFAULT NULL,
  `submitTime` date NOT NULL,
  `lastModifiedTime` date NOT NULL,
  `state` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `check` json DEFAULT NULL,
  `target1` json DEFAULT NULL,
  `target2` json DEFAULT NULL,
  `target3` json DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `bysj_teacher` (`teacher`),
  KEY `bysj_student` (`student`),
  CONSTRAINT `bysj_student` FOREIGN KEY (`student`) REFERENCES `student` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bysj_teacher` FOREIGN KEY (`teacher`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bysj`
--

LOCK TABLES `bysj` WRITE;
/*!40000 ALTER TABLE `bysj` DISABLE KEYS */;
/*!40000 ALTER TABLE `bysj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kcsj`
--

DROP TABLE IF EXISTS `kcsj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `kcsj` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(16) NOT NULL,
  `num` int(10) unsigned NOT NULL,
  `description` varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` varchar(255) NOT NULL,
  `place` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `capacity` int(10) unsigned NOT NULL,
  `teachers` json NOT NULL,
  `students` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kcsj`
--

LOCK TABLES `kcsj` WRITE;
/*!40000 ALTER TABLE `kcsj` DISABLE KEYS */;
/*!40000 ALTER TABLE `kcsj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `news` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `top` tinyint(1) unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `publisher` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '管理员',
  `date` date NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,1,'第一次测试用通知···','管理员','2020-08-30'),(2,0,'第二次测试通知···','管理员','2020-08-30');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scsx`
--

DROP TABLE IF EXISTS `scsx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scsx` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `class` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `specialty` varchar(16) NOT NULL,
  `teacher` int(10) unsigned DEFAULT NULL,
  `mode` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `place` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `employer` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher`),
  CONSTRAINT `teacher_id` FOREIGN KEY (`teacher`) REFERENCES `teacher` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scsx`
--

LOCK TABLES `scsx` WRITE;
/*!40000 ALTER TABLE `scsx` DISABLE KEYS */;
/*!40000 ALTER TABLE `scsx` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scsx_report`
--

DROP TABLE IF EXISTS `scsx_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scsx_report` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(10) unsigned NOT NULL,
  `student` int(10) unsigned NOT NULL,
  `filename` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `score` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scsx_task_student` (`task_id`,`student`) USING BTREE,
  KEY `scsx_report_student_id` (`student`),
  CONSTRAINT `scsx_report_student_id` FOREIGN KEY (`student`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scsx_task_id` FOREIGN KEY (`task_id`) REFERENCES `scsx_task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scsx_report`
--

LOCK TABLES `scsx_report` WRITE;
/*!40000 ALTER TABLE `scsx_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `scsx_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scsx_task`
--

DROP TABLE IF EXISTS `scsx_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scsx_task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `scsx_id` int(10) unsigned NOT NULL,
  `mode` varchar(16) NOT NULL,
  `deadline` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scsx_id` (`scsx_id`),
  CONSTRAINT `scsx_id` FOREIGN KEY (`scsx_id`) REFERENCES `scsx` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scsx_task`
--

LOCK TABLES `scsx_task` WRITE;
/*!40000 ALTER TABLE `scsx_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `scsx_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gender` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `schoolNum` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `specialty` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `group` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `class` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `postGraduate` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '否',
  `username` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `wechat` varchar(255) DEFAULT NULL,
  `tel` char(16) DEFAULT NULL,
  `homepage` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `resume` varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'蔡尽云','男','15011135','自动化','1-自动控制与模式识别','160322','否','jason','5c3822912406cdb5e7c39580a18cf2bc','2452816044@qq.com','c2452816044','18801205387','https://zhizunjiege.github.io','我是开发者。。。'),(2,'姚力炜','男','16031011','自动化','1-自动控制与模式识别','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'谢宇涵','女','16031027','自动化','1-自动控制与模式识别','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'张舜禹','男','16031041','自动化','1-自动控制与模式识别','160326','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'姜晗睿','男','16031114','自动化','1-自动控制与模式识别','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'黄德彬','男','16031117','自动化','1-自动控制与模式识别','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'范毅博','男','16031127','自动化','1-自动控制与模式识别','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'沈一凡','男','16031128','自动化','1-自动控制与模式识别','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'郭亮晖','男','16031136','自动化','1-自动控制与模式识别','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'韩博崴','男','16031147','自动化','1-自动控制与模式识别','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'黄俊杰','男','16031155','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'黄浩纯','男','16031161','自动化','1-自动控制与模式识别','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'赵文宇','男','16031168','自动化','1-自动控制与模式识别','160324','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'刘强','男','16031178','自动化','1-自动控制与模式识别','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'王奕博','男','16031181','自动化','1-自动控制与模式识别','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'王晨阳','男','16031196','自动化','1-自动控制与模式识别','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'浦一凡','男','16031198','自动化','1-自动控制与模式识别','160326','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'刘华瑞','女','16051141','自动化','1-自动控制与模式识别','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'邹雅芳','女','16071032','自动化','1-自动控制与模式识别','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'李天成','男','16071036','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'张奇鹏','男','16071075','自动化','1-自动控制与模式识别','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'贾顺程','男','16131067','自动化','1-自动控制与模式识别','160324','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'董航','男','16711010','自动化','1-自动控制与模式识别','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'李修川','男','16711016','自动化','1-自动控制与模式识别','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'赵婧姣','女','16711025','自动化','1-自动控制与模式识别','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'向岩松','男','16711039','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'金珩','男','16711049','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'胡昆','男','16711050','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'刘靖宇','男','16711064','自动化','1-自动控制与模式识别','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'周鸿翔','男','16711084','自动化','1-自动控制与模式识别','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'冯艾晨','女','16711093','自动化','1-自动控制与模式识别','160324','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'李翰韬','男','16711094','自动化','1-自动控制与模式识别','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'李子建','男','16711097','自动化','1-自动控制与模式识别','160324','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'李东泽','男','16711098','自动化','1-自动控制与模式识别','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'裴文渊','男','16711105','自动化','1-自动控制与模式识别','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'廖晨阳','男','16721071','自动化','1-自动控制与模式识别','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'申佳军','男','16721115','自动化','1-自动控制与模式识别','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,'李英男','男','76216002','自动化','1-自动控制与模式识别','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,'陈宏旭','男','16031012','自动化','2-自主导航与精确制导','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,'王梓瑜','男','16031014','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,'彭蕴韬','男','16031045','自动化','2-自主导航与精确制导','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,'林熠阳','男','16031046','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'王俊杰','男','16031118','自动化','2-自主导航与精确制导','160321','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'毛立州','男','16031122','自动化','2-自主导航与精确制导','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'王嘉浩','男','16031130','自动化','2-自主导航与精确制导','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,'范文虎','男','16031138','自动化','2-自主导航与精确制导','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'吴炳坤','男','16031144','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,'吴泽炎','男','16031148','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'韩张弛','男','16031149','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'翟雁军','男','16031151','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'王伊萌','男','16031157','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'辛济远','男','16031160','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'宋子雄','男','16031162','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'夏笠城','男','16031165','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'黄忠勋','男','16031169','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'王嘉祺','男','16031172','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'袁源','男','16031173','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,'张宸宇','男','16031179','自动化','2-自主导航与精确制导','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,'史文博','男','16031184','自动化','2-自主导航与精确制导','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,'张丹','男','16031204','自动化','2-自主导航与精确制导','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,'刘跃兵','男','16041211','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,'杨思捷','男','16041233','自动化','2-自主导航与精确制导','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,'尚威','男','16091050','自动化','2-自主导航与精确制导','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,'李东来','男','16711054','自动化','2-自主导航与精确制导','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,'许星源','男','16711100','自动化','2-自主导航与精确制导','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,'冷佳俊','男','16711120','自动化','2-自主导航与精确制导','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,'杨家伟','男','16711140','自动化','2-自主导航与精确制导','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,'王轩','男','14031032','自动化','3-检测与自动化工程','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,'杜博洋','男','14031194','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,'吴凡','男','15005003','自动化','3-检测与自动化工程','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,'王皓石','男','15031172','自动化','3-检测与自动化工程','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,'董若琳','女','15031181','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,'边彤飞','男','16031101','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,'苏威炬','男','16031107','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,'李正桓','男','16031108','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,'王浩人','男','16031110','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,'王克','男','16031111','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'姜帅臣','男','16031112','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'吴正钢','男','16031113','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,'马钰棠','男','16031115','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,'刘鑫','男','16031119','自动化','3-检测与自动化工程','160321','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'路复宇','男','16031120','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'彭泰膺','男','16031121','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,'赵飞虎','男','16031125','自动化','3-检测与自动化工程','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,'严晋龙','男','16031163','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'熊琦珞','男','16031185','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,'覃一凌','男','16031186','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,'费小远','男','16031187','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,'雷欣哲','男','16031188','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,'杜嵩明','男','16031193','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,'郭丞皓','男','16031194','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,'赖晶','男','16031199','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,'王一帆','男','16031200','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(94,'粟英桐','男','16031201','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(95,'罗幅元','男','16031203','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(96,'李沐泽','男','16101050','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(97,'邓楚天','男','16101060','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(98,'何坤','男','16151025','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(99,'李佳蔚','女','16171090','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(100,'梁思远','男','16711020','自动化','3-检测与自动化工程','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(101,'刘馨竹','女','16711023','自动化','3-检测与自动化工程','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(102,'付麟钧','女','16711068','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(103,'关腾飞','男','16711077','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(104,'于东洋','男','16711078','自动化','3-检测与自动化工程','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(105,'王钲日','男','16711101','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(106,'王玉立','男','16711106','自动化','3-检测与自动化工程','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(107,'张全超','男','16711124','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(108,'李昊田','男','16711128','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(109,'姜驰','男','16711143','自动化','3-检测与自动化工程','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(110,'荀耕','男','14031125','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(111,'田冬','男','15031225','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(112,'柯超凡','男','16011080','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(113,'黄旭聪','男','16011142','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(114,'野召斌','男','16031104','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(115,'马乐','男','16031105','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(116,'司佳帅','男','16031106','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(117,'肖瑶','男','16031109','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(118,'王志翔','男','16031123','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(119,'佘佳伟','男','16031124','自动化','4-飞行器控制与仿真','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(120,'杨双萍','女','16031126','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(121,'南鹏程','男','16031129','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(122,'刘瑞恒','男','16031132','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(123,'金同清','男','16031133','自动化','4-飞行器控制与仿真','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(124,'黄毅强','男','16031135','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(125,'向宏程','男','16031137','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(126,'任斌','男','16031140','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(127,'李向敏','女','16031142','自动化','4-飞行器控制与仿真','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(128,'蔡逸熙','男','16031154','自动化','4-飞行器控制与仿真','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(129,'何舒扬','女','16031158','自动化','4-飞行器控制与仿真','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(130,'孙小寒','女','16031159','自动化','4-飞行器控制与仿真','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(131,'王知屹','男','16031166','自动化','4-飞行器控制与仿真','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(132,'黄泽军','男','16031170','自动化','4-飞行器控制与仿真','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(133,'姜承志','女','16031174','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(134,'酆禾阳','男','16031176','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(135,'王泽源','男','16031180','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(136,'姜嘉成','男','16031182','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(137,'王涛','男','16031183','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(138,'陈恩民','男','16031189','自动化','4-飞行器控制与仿真','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(139,'王丹','女','16031190','自动化','4-飞行器控制与仿真','160326','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(140,'张文欣','女','16031191','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(141,'曹衡','男','16031192','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(142,'韩宏伟','男','16031195','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(143,'唐泰苒','男','16031202','自动化','4-飞行器控制与仿真','160326','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(144,'李泽鑫','男','16051034','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(145,'叶双休','女','16151014','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(146,'张昭维','男','16151026','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(147,'朱俊','男','16171034','自动化','4-飞行器控制与仿真','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(148,'谢永炫','男','16271015','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(149,'李梓晴','女','16711002','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(150,'赵路明','男','16711008','自动化','4-飞行器控制与仿真','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(151,'严瑞辉','男','16711009','自动化','4-飞行器控制与仿真','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(152,'曹驰宇','男','16711017','自动化','4-飞行器控制与仿真','160322','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(153,'彭斯雨','女','16711026','自动化','4-飞行器控制与仿真','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(154,'吕硕','男','16711052','自动化','4-飞行器控制与仿真','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(155,'张钰清','女','16711070','自动化','4-飞行器控制与仿真','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(156,'冯硕','男','16711117','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(157,'孙瑜','女','16711133','自动化','4-飞行器控制与仿真','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(158,'侯国庆','男','16711139','自动化','4-飞行器控制与仿真','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(159,'邓紫航','男','15031153','自动化','5-机电控制与液压','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(160,'寇汉卿','男','15031178','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(161,'王瑞生','男','15071012','自动化','5-机电控制与液压','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(162,'陈嵘卿','男','16031116','自动化','5-机电控制与液压','160321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(163,'贾滨','男','16031131','自动化','5-机电控制与液压','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(164,'陈思远','男','16031134','自动化','5-机电控制与液压','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(165,'甘博','男','16031139','自动化','5-机电控制与液压','160322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(166,'赵芹','女','16031143','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(167,'李闻达','男','16031145','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(168,'司宏飞','男','16031146','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(169,'田野','男','16031150','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(170,'李少石','男','16031152','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(171,'张正阳','男','16031153','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(172,'何成','男','16031156','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(173,'杨文硕','男','16031164','自动化','5-机电控制与液压','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(174,'周洁华','男','16031167','自动化','5-机电控制与液压','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(175,'陈晨cc','女','16031175','自动化','5-机电控制与液压','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(176,'董程博','男','16031177','自动化','5-机电控制与液压','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(177,'姜鹤','男','16031197','自动化','5-机电控制与液压','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(178,'陈子扬','男','16711035','自动化','5-机电控制与液压','160323','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(179,'何思源','男','16711038','自动化','5-机电控制与液压','160323','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(180,'韩美琳','女','16711089','自动化','5-机电控制与液压','160326','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(181,'安原','男','16711096','自动化','5-机电控制与液压','160324','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(182,'童畅','男','16711102','自动化','5-机电控制与液压','160325','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(183,'董灯鹏','男','16711103','自动化','5-机电控制与液压','160325','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(184,'石鸿柄','男','16711131','自动化','5-机电控制与液压','160326','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(185,'郭子辰','男','14031025','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(186,'格勒斯','男','15005008','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(187,'曹风于','男','15031010','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(188,'盛亦佳','女','15031024','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(189,'张颖','男','15271147','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(190,'苏树业','女','16031001','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(191,'董雅淇','女','16031002','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(192,'汤一玮','女','16031003','电气工程及其自动化','6-电气','160311','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(193,'杜棉','女','16031004','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(194,'惠薇','女','16031005','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(195,'谢雪芳','女','16031006','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(196,'生子豪','男','16031007','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(197,'张泰豪','男','16031008','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(198,'李思琦','男','16031009','电气工程及其自动化','6-电气','160311','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(199,'安中正','男','16031010','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(200,'甄子玮','男','16031013','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(201,'朱永川','男','16031015','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(202,'曲家利','男','16031016','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(203,'张敬华','男','16031017','电气工程及其自动化','6-电气','160311','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(204,'彭俊淇','男','16031018','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(205,'庄泽焕','男','16031019','电气工程及其自动化','6-电气','160311','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(206,'陈彦辰','男','16031020','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(207,'戚凇','男','16031021','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(208,'王弘毅','男','16031022','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(209,'王斌斌','男','16031023','电气工程及其自动化','6-电气','160311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(210,'柴雅梦','女','16031024','电气工程及其自动化','6-电气','160312','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(211,'张敬雯','女','16031025','电气工程及其自动化','6-电气','160312','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(212,'李思奇','女','16031026','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(213,'岳云霞','女','16031028','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(214,'李佳怡','女','16031030','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(215,'刘盛博','男','16031031','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(216,'董舰桥','男','16031032','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(217,'段一鸣','男','16031034','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(218,'栗大林','男','16031035','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(219,'周昊天','男','16031036','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(220,'于尚彤','男','16031037','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(221,'李靖豪','男','16031039','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(222,'侯费隐','男','16031040','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(223,'赖勋秦','男','16031042','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(224,'唐宏星','男','16031043','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(225,'文俊杰','男','16031044','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(226,'徐梓喬','男','G1820301','电气工程及其自动化','6-电气','160312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(227,'苏瑞博','男','16011113','自动化','7-高工','162312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(228,'张瑞江','男','16041178','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(229,'吴楠','女','16051029','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(230,'李大','男','16101061','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(231,'范益典','男','16131072','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(232,'郑文喆','男','16151050','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(233,'刘迪','女','16231003','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(234,'沈滨沨','男','16231007','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(235,'李跃','男','16231008','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(236,'黄博昊','男','16231009','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(237,'朱贺','男','16231018','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(238,'邱宏程','男','16231023','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(239,'毛鹏达','男','16231024','自动化','7-高工','162311','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(240,'王钧乐','男','16231035','自动化','7-高工','162312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(241,'栾赫轩','男','16231042','自动化','7-高工','162312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(242,'常杰灵','男','16231043','自动化','7-高工','162312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(243,'罗竣轩','男','16231045','自动化','7-高工','162312','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(244,'王羽洁','女','16231051','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(245,'王馨悦','女','16231054','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(246,'赵谦','男','16231059','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(247,'杨骞','男','16231060','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(248,'郝睿阳','男','16231074','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(249,'蔡昕钰','男','16231075','自动化','7-高工','162313','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(250,'张祎頔','女','16231076','自动化','7-高工','162314','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(251,'刘志豪','男','16231087','自动化','7-高工','162314','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(252,'马欣阳','男','16231088','自动化','7-高工','162314','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(253,'艾雨豪','男','16231091','自动化','7-高工','162314','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(254,'樊恩雨','男','16231093','自动化','7-高工','162314','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(255,'段晓迪','女','16231104','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(256,'刘宏','男','16231105','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(257,'刘子骁','男','16231106','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(258,'杨瀚文','男','16231107','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(259,'秦鸿宇','男','16231110','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(260,'何信','男','16231111','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(261,'王薪宇','男','16231117','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(262,'马雪虎','男','16231123','自动化','7-高工','162315','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(263,'沈力','男','16231139','自动化','7-高工','162316','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(264,'段锦帆','男','16231142','自动化','7-高工','162316','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(265,'蔡逸扬','男','16231148','自动化','7-高工','162316','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(266,'张高扬','男','16231150','自动化','7-高工','162316','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(267,'范锦蓉','女','16231152','自动化','7-高工','162317','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(268,'阿杨镪','男','16231174','自动化','7-高工','162317','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(269,'姚书凝','女','16231178','自动化','7-高工','162318','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(270,'董家宝','男','16231184','自动化','7-高工','162318','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(271,'夏涵','男','16231189','自动化','7-高工','162318','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(272,'黄振桓','男','16231192','自动化','7-高工','162318','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(273,'游虎杰','男','16231195','自动化','7-高工','162318','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(274,'樊艳春','男','16231210','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(275,'赵毅琳','男','16231211','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(276,'田雨鑫','男','16231215','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(277,'刘宇航','男','16231220','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(278,'李世垚','男','16231225','自动化','7-高工','162319','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(279,'雷彤彤','女','16231229','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(280,'韩梓钰','男','16231234','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(281,'李谨杰','男','16231235','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(282,'左一鸣','男','16231239','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(283,'郭帅','男','16231245','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(284,'吕一哲','男','16231249','自动化','7-高工','162320','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(285,'杨曼鑫','男','16231261','自动化','7-高工','162321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(286,'于浩然','男','16231262','自动化','7-高工','162321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(287,'马特立','男','16231264','自动化','7-高工','162321','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(288,'朱艺铭','女','16231277','自动化','7-高工','162322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(289,'马恺珧','女','16231280','自动化','7-高工','162322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(290,'赵亮','男','16231286','自动化','7-高工','162322','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(291,'姜新宇','男','16271034','自动化','7-高工','162317','否','jasonn','5c3822912406cdb5e7c39580a18cf2bc','2452816044@qq.com',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `teacher` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gender` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `schoolNum` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `proTitle` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '讲师',
  `group` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `department` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ifDean` char(1) NOT NULL DEFAULT '否',
  `ifHead` char(1) NOT NULL DEFAULT '否',
  `username` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `wechat` varchar(255) DEFAULT NULL,
  `tel` char(16) DEFAULT NULL,
  `homepage` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `resume` varchar(1023) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `office` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `field` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'王岩','女','07965','副教授','1-自动控制与模式识别','301','否','是','jason','5c3822912406cdb5e7c39580a18cf2bc','2452816044@qq.com',NULL,NULL,NULL,NULL,NULL,NULL),(2,'张宝昌','男','08667','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'秦曾昌','男','08940','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'王磊','男','09004','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'刘杨','女','09179','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'孟德元','男','09251','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'左宗玉','男','09429','副教授','1-自动控制与模式识别','301','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'李文玲','男','09510','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'王薇','女','09917','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'诸兵','男','10117','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'郭玉柱','男','10127','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'郑建英','女','10324','副教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'张臻','男','07861','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'张霄','男','09312','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'王陈亮','男','09593','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'乔建忠','男','09770','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'王田','男','09821','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'郑泽伟','男','09830','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'李明星','男','10100','讲师','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'霍伟','男','01675','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'贾英民','男','05773','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'马保离','男','06351','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'郑红','女','06737','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'吴淮宁','男','06901','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'刘金琨','男','06951','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'郝飞','男','07866','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'郭雷','男','08665','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'闫鹏','男','09555','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'李阳','男','09604','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'胡庆雷','男','09749','教授','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'余翔','男','10296','特别研究员','1-自动控制与模式识别','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'袁少强','男','00619','副教授','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'王艳东','女','05953','副教授','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'张海','男','06816','副教授','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'江加和','男','07107','副教授','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'蒋宏','女','07333','副教授','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'宋华','男','07450','副教授','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,'王秋生','男','07725','副教授','2-自主导航与精确制导','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,'张军香','女','08001','副教授','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,'杨静','女','08130','副教授','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,'王玲玲','女','08422','副教授','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,'董希旺','男','09826','副教授','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'张李勇','女','05006','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'林新','男','07522','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'沈晓蓉','女','08046','讲师','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,'姚楠','女','08166','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'刘中','男','08190','讲师','2-自主导航与精确制导','306','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,'董韶鹏','男','08420','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'崔勇','男','08429','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'李清东','男','08978','讲师','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'彭娟娟','女','09940','讲师','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'吴云洁','女','05971','教授','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'富立','女','06532','教授','2-自主导航与精确制导','306','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'王青','女','06935','教授','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'任章','男','07227','教授','2-自主导航与精确制导','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'赵龙','男','07883','教授','2-自主导航与精确制导','301','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'崔建宗','男','01950','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,'艾虹','女','03L03','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,'范昌波','男','04449','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,'王建华','男','04605','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,'叶卫东','男','05074','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,'吴冠','男','05242','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,'袁梅','女','05910','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,'唐瑶','女','06501','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,'扈宏杰','男','07270','副教授','3-检测与自动化工程','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,'李莉','女','07346','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,'闫蓓','女','07429','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,'陈胜功','男','07474','副教授','3-检测与自动化工程','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,'万久卿','男','07649','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,'于劲松','男','07865','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,'周强','男','07874','副教授','3-检测与自动化工程','307','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,'刘敬猛','男','07879','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,'袁海斌','男','07911','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,'魏鹏','男','08378','副教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,'肖瑾','女','08638','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,'徐东','男','08988','副教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,'彭朝琴','女','08058','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'高占宝','男','08351','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'刘颖异','女','09339','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,'张秀磊','男','09494','讲师','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,'张静','女','09623','讲师','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'张蓓','女','09711','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'吕建勋','男','09829','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,'岳昊嵩','男','09928','讲师','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,'唐荻音','女','09960','讲师','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'吴星明','男','04825','教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,'刘亚斌','男','05066','教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,'杨波','女','06408','教授','3-检测与自动化工程','302','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,'袁海文','男','06512','教授','3-检测与自动化工程','302','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,'胡晓光','女','07876','教授','3-检测与自动化工程','307','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,'夏洁','女','06298','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,'刘丽','女','06471','副教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,'张国峰','男','06555','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(94,'魏晨','女','06927','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(95,'王江云','女','07277','副教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(96,'董卓宁','男','07605','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(97,'张庆振','男','07770','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(98,'刘正华','男','07856','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(99,'宋晓','男','08122','副教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(100,'蔡志浩','男','08555','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(101,'杨凌宇','男','08679','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(102,'雷小永','男','08845','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(103,'吴江','男','09233','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(104,'全权','男','09252','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(105,'任磊','男','09428','副教授','4-飞行器控制与仿真','308','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(106,'奚知宇','女','09894','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(107,'刘克新','男','10345','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(108,'铁林','男','91191','副教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(109,'汤新宇','女','04977','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(110,'李卫琪','男','07902','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(111,'马耀飞','男','08877','讲师','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(112,'殷蓓蓓','女','09167','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(113,'赵永嘉','男','09178','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(114,'赖李媛君','女','09976','讲师','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(115,'赵江','男','10101','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(116,'邓亦敏','男','10219','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(117,'张晶','女','91176','讲师','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(118,'戴树岭','男','05252','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(119,'蔡开元','男','05253','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(120,'吴森堂','男','05664','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(121,'王卫红','女','06483','教授','4-飞行器控制与仿真','305','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(122,'周锐','男','06590','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(123,'龚光红','女','06630','教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(124,'白成刚','男','06924','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(125,'王宏伦','男','07041','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(126,'段海滨','男','07985','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(127,'张霖','男','08085','教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(128,'郑征','男','08253','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(129,'李妮','女','08266','教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(130,'陶飞','男','08965','教授','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(131,'吕金虎','男','10272','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(132,'高庆','男','10468','教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(133,'张绪','男','B16020','助理教授','4-飞行器控制与仿真','305','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(134,'马田','男','09669','助理研究员','4-飞行器控制与仿真','308','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(135,'高元楼','男','07268','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(136,'刘永光','男','07273','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(137,'唐志勇','男','07602','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(138,'杨丽曼','女','08191','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(139,'石健','男','08558','副教授','5-机电控制与液压','303','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(140,'尚耀星','男','09065','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(141,'石岩','男','09478','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(142,'王兴坚','男','09479','副教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(143,'沈东凯','男','07612','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(144,'张超','男','09838','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(145,'徐远志','男','09839','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(146,'许未晴','男','09983','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(147,'吴帅','男','91171','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(148,'高晓辉','男','B17010','讲师','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(149,'焦宗夏','男','05496','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(150,'王少萍','女','06021','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(151,'于黎明','女','06035','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(152,'李运华','男','06140','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(153,'裴忠才','男','06622','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(154,'王亮','男','07082','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(155,'蔡茂林','男','08209','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(156,'严亮','男','09122','教授','5-机电控制与液压','303','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(157,'石景坡','男','04594','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(158,'王自强','男','06920','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(159,'张俊民','男','07496','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(160,'赵向阳','男','07529','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(161,'王永','男','08269','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(162,'吴静','女','08282','副教授','6-电气','304','是','是',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(163,'丁晓峰','男','09483','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(164,'刘钰山','女','10230','副教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(165,'金巍','女','06974','讲师','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(166,'徐金全','男','09959','讲师','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(167,'陈兴乐','男','09965','讲师','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(168,'马齐爽','男','06472','教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(169,'郭宏','男','06519','教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(170,'武建文','男','07246','教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(171,'肖春燕','女','07502','教授','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(172,'邹丽萍','女','05652','实验师','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(173,'邢伟','男','09207','工程师','6-电气','304','否','否',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-30 22:49:47
