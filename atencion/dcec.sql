-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 17-12-2020 a las 14:41:52
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dcec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admmenu`
--

CREATE TABLE `admmenu` (
  `idMenu` int(11) NOT NULL,
  `idDiv` varchar(100) DEFAULT NULL,
  `paginaHref` varchar(100) DEFAULT NULL,
  `tituloMenu` varchar(100) DEFAULT NULL,
  `descripcionDelMenu` varchar(100) DEFAULT NULL,
  `iconoDelMenu` varchar(100) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `admmenu`
--

INSERT INTO `admmenu` (`idMenu`, `idDiv`, `paginaHref`, `tituloMenu`, `descripcionDelMenu`, `iconoDelMenu`, `orden`) VALUES
(1, 'catPacientes', 'Pacientes', 'Expedientes', '', 'fa fa-users', 1),
(2, 'catPadecimientos', 'admCatPadecimientos', 'Cat. de padecimientos', '', 'fa fa-frown', 3),
(3, 'catDepartamentos', 'admCatDepartamentos', 'Cat. de departamenos', '', 'fa fa-hospital', 4),
(4, 'admConsultas', 'admConsultas', 'Ver consultas pendientes', '', 'fa fa-hourglass-half', 5),
(5, 'admUsuarios', 'Usuarios', 'Administración de usuarios', '', 'fa fa-user-circle', 6),
(6, 'opeAtencionMedica', 'admAtencionMedica', 'Atención médica', '', 'fa fa-user-md', 8),
(7, 'rptReporteDeTurno', 'rptReporteDeTurno', 'Reporte de turno', '', 'fa fa-file-medical', 10),
(8, 'rptReporteEstadisticas', 'rptReporteEstadisticas', 'Reporte de estadísticas', '', 'fa fa-percent', 11),
(10, 'opeRecuperaAtencion', 'admRecuperarAtencion', 'Recuperar consulta de paciente', '', 'fa fa-undo', 9),
(11, 'admRespalda', 'admRespalda', 'Respaldar base de datos', '', 'fa fa-download', 7),
(12, 'rptCronicoDegenerativos', 'rptCronicoDegenerativos', 'Reporte de Crónico degenerativos', '', 'fa fa-procedures', 13),
(13, 'catPacienteSeguroSocial', 'admPacientesSeguroSocial', 'Seguro social de pacientes', '', 'fa fa-address-card', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admusuariomenu`
--

CREATE TABLE `admusuariomenu` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idMenu` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `admusuariomenu`
--

INSERT INTO `admusuariomenu` (`id`, `idUsuario`, `idMenu`) VALUES
(1, 1, 1),
(5, 1, 5),
(131, 11, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admusuarios`
--

CREATE TABLE `admusuarios` (
  `idUsuario` int(11) NOT NULL,
  `nombreUsuario` varchar(100) DEFAULT NULL,
  `clave` varchar(20) DEFAULT NULL,
  `pwd` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `admusuarios`
--

INSERT INTO `admusuarios` (`idUsuario`, `nombreUsuario`, `clave`, `pwd`) VALUES
(1, 'Lic. Joel Clemente Serrano', 'jclemente', '906de634c48fb7d34136160b4c353ae4'),
(11, 'Carlos Espinoza Clemente', 'cespinoza', 'a56da6f5e6f19805a3b652c7b7bbc3f6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catpadecimientos`
--

CREATE TABLE `catpadecimientos` (
  `idPadecimiento` int(11) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `catpadecimientos`
--

INSERT INTO `catpadecimientos` (`idPadecimiento`, `descripcion`) VALUES
(1, 'Hipertensión'),
(2, 'Diabetes'),
(3, 'Dislipidemias'),
(4, 'Gastrointestinales'),
(5, 'Respiratorias'),
(6, 'Musculoesqueléticas'),
(7, 'Control de peso'),
(8, 'Genitourinarias'),
(9, 'Dermatológicas'),
(10, 'Cirugía menor'),
(11, 'Oftalmológicas'),
(12, 'Otras');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expediente`
--

CREATE TABLE `expediente` (
  `idExpediente` int(11) NOT NULL,
  `motivoDeConsulta` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `dx` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ta` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `fc` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `temp` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `glucosa` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `peso` decimal(10,3) DEFAULT NULL,
  `talla` decimal(10,2) DEFAULT NULL,
  `imc` decimal(10,2) DEFAULT NULL,
  `tratamiento` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `idPaciente` int(11) NOT NULL,
  `idPadecimiento` int(11) NOT NULL,
  `estado` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Pendiente, Atendido, Cancelado',
  `atendidoPor` varchar(100) DEFAULT NULL,
  `nota` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `expediente`
--

INSERT INTO `expediente` (`idExpediente`, `motivoDeConsulta`, `fecha`, `dx`, `ta`, `fc`, `temp`, `glucosa`, `peso`, `talla`, `imc`, `tratamiento`, `idPaciente`, `idPadecimiento`, `estado`, `atendidoPor`, `nota`) VALUES
(1, '<p>Herida en la cabeza</p>', '2020-12-16 00:00:00', '<p>Sutura</p>', '130/90', '89', '36.4', '', '93.000', '171.00', '31.80', '<p>Diclofenaco 100mg tabletas<br>Ingerir una tableta después del desayuno y cena por 5 días.<br>Curación mañana entre 15 y 19hrs.<br>Retiro de puntos en una semana</p>', 3, 10, 'Atendido', 'Lic. Joel Clemente Serrano', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `idPaciente` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apPaterno` varchar(100) DEFAULT NULL,
  `apMaterno` varchar(100) DEFAULT NULL,
  `fechaDeNacimiento` date DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `alergias` varchar(250) DEFAULT NULL,
  `antPatFam` varchar(250) DEFAULT NULL,
  `antPatPer` varchar(250) DEFAULT NULL,
  `celular` varchar(100) DEFAULT NULL,
  `contacto` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `esDiabetico` int(11) DEFAULT NULL COMMENT 'DM',
  `esHipertenso` int(11) DEFAULT NULL COMMENT 'HTA',
  `esDislipidemico` varchar(45) DEFAULT NULL COMMENT 'DSP',
  `religion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`idPaciente`, `nombre`, `apPaterno`, `apMaterno`, `fechaDeNacimiento`, `sexo`, `alergias`, `antPatFam`, `antPatPer`, `celular`, `contacto`, `correo`, `esDiabetico`, `esHipertenso`, `esDislipidemico`, `religion`) VALUES
(3, 'Uziel', 'Clemente', 'Cruz', '1995-05-03', 'Masculino', 'Polvo, pelo de animales', 'Ninguno', '', '2282432291', '2282430913, su papá', '', 0, 0, '0', ''),
(4, 'Sarai', 'Clemente', 'Cruz', '2003-03-24', 'Femenino', 'Munorol ', '', '', '', '', '', 0, 0, '0', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admmenu`
--
ALTER TABLE `admmenu`
  ADD PRIMARY KEY (`idMenu`);

--
-- Indices de la tabla `admusuariomenu`
--
ALTER TABLE `admusuariomenu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_admusuariomenu_admusuarios1` (`idUsuario`),
  ADD KEY `fk_admusuariomenu_admmenu1` (`idMenu`);

--
-- Indices de la tabla `admusuarios`
--
ALTER TABLE `admusuarios`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indices de la tabla `catpadecimientos`
--
ALTER TABLE `catpadecimientos`
  ADD PRIMARY KEY (`idPadecimiento`);

--
-- Indices de la tabla `expediente`
--
ALTER TABLE `expediente`
  ADD PRIMARY KEY (`idExpediente`),
  ADD KEY `fk_expediente_paciente1` (`idPaciente`),
  ADD KEY `fk_expediente_catPadecimientos1` (`idPadecimiento`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`idPaciente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admmenu`
--
ALTER TABLE `admmenu`
  MODIFY `idMenu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `admusuariomenu`
--
ALTER TABLE `admusuariomenu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT de la tabla `admusuarios`
--
ALTER TABLE `admusuarios`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `catpadecimientos`
--
ALTER TABLE `catpadecimientos`
  MODIFY `idPadecimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `expediente`
--
ALTER TABLE `expediente`
  MODIFY `idExpediente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `idPaciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
