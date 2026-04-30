-- ================================================================
-- CRM EXTRUCOL: Guia para crear Application Processes en APEX
-- Ejecutar en: APEX Builder (no en SQL Commands)
--
-- PASOS EN APEX BUILDER:
-- 1. Ir a App Builder > Tu App > Shared Components
-- 2. Click en "Application Processes"
-- 3. Crear cada proceso con las opciones abajo
-- ================================================================

-- ================================================================
-- PROCESO 1: LEADS_CATALOGOS
-- ================================================================
/*
Name:         LEADS_CATALOGOS
Type:         Application Process
Sequence:     10
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_CATALOGOS(:RESULT);
END;

Parameters: Ninguno (el resultado sale en :RESULT)
*/

-- ================================================================
-- PROCESO 2: LEADS_LIST
-- ================================================================
/*
Name:         LEADS_LIST
Type:         Application Process
Sequence:     20
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_LIST(:RESULT, :X01, :X02);
END;

Parameters:
  - Name: X01  (Tipo: PAGE ITEM, Subtipo: TEXT)
  - Name: X02  (Tipo: PAGE ITEM, Subtipo: TEXT)
*/

-- ================================================================
-- PROCESO 3: LEADS_GET
-- ================================================================
/*
Name:         LEADS_GET
Type:         Application Process
Sequence:     30
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_GET(:RESULT, :X01);
END;

Parameters:
  - Name: X01  (Tipo: PAGE ITEM, Subtipo: TEXT)
*/

-- ================================================================
-- PROCESO 4: LEADS_CREATE
-- ================================================================
/*
Name:         LEADS_CREATE
Type:         Application Process
Sequence:     40
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_CREATE(:RESULT,
    :X01, :X02, :X03, :X04, :X05, :X06,
    :X07, :X08, :X09, :X10, :X11, :X12);
END;

Parameters: X01 a X12 (todos PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 5: LEADS_UPDATE
-- ================================================================
/*
Name:         LEADS_UPDATE
Type:         Application Process
Sequence:     50
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_UPDATE(:RESULT,
    :X01, :X02, :X03, :X04, :X05, :X06,
    :X07, :X08, :X09, :X10, :X11, :X12);
END;

Parameters: X01 a X12 (todos PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 6: LEADS_DESCALIFICAR
-- ================================================================
/*
Name:         LEADS_DESCALIFICAR
Type:         Application Process
Sequence:     60
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_DESCALIFICAR(:RESULT, :X01, :X02, :X03);
END;

Parameters: X01, X02, X03 (PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 7: LEADS_CONVERTIR
-- ================================================================
/*
Name:         LEADS_CONVERTIR
Type:         Application Process
Sequence:     70
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_CONVERTIR(:RESULT,
    :X01, :X02, :X03, :X04, :X05, :X06,
    :X07, :X08, :X09, :X10, :X11, :X12, :X13);
END;

Parameters: X01 a X13 (todos PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 8: LEADS_HISTORIAL
-- ================================================================
/*
Name:         LEADS_HISTORIAL
Type:         Application Process
Sequence:     80
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_HISTORIAL(:RESULT, :X01);
END;

Parameters: X01 (PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 9: LEADS_AGREGAR_INTERES
-- ================================================================
/*
Name:         LEADS_AGREGAR_INTERES
Type:         Application Process
Sequence:     90
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_AGREGAR_INTERES(:RESULT, :X01, :X02);
END;

Parameters: X01, X02 (PAGE ITEM TEXT)
*/

-- ================================================================
-- PROCESO 10: LEADS_QUITAR_INTERES
-- ================================================================
/*
Name:         LEADS_QUITAR_INTERES
Type:         Application Process
Sequence:     100
Point:        On Submit - After Processing
Source:
BEGIN
  CRM_LEADS_API.LEADS_QUITAR_INTERES(:RESULT, :X01, :X02);
END;

Parameters: X01, X02 (PAGE ITEM TEXT)
*/

-- ================================================================
-- VERIFICACION DE PAQUETE
-- ================================================================
-- En SQL Commands ejecutar para verificar:
SELECT object_name, object_type, status
FROM user_objects
WHERE object_name = 'CRM_LEADS_API';

SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'CRM_LEAD%';

SELECT table_name FROM user_tables WHERE table_name LIKE 'CRM_LEAD%';