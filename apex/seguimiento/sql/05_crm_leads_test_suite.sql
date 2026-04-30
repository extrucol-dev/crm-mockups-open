--------------------------------------------------------------------------------
-- CRM EXTRUCOL: Test script —验证 leads end-to-end
-- Ejecutar en SQL Workshop para validar todos los procesos del package
-- Autor: opencode
-- Fecha: 2026-04-30
--------------------------------------------------------------------------------

SET SERVEROUTPUT ON;
SET FEEDBACK OFF;

PROMPT ============================================================
PROMPT TEST SUITE: CRM_LEADS_API — Validacion end-to-end
PROMPT ============================================================

PROMPT
PROMPT --- TEST 1: LEADS_CATALOGOS ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_row NUMBER;
BEGIN
    CRM_LEADS_API.LEADS_CATALOGOS(v_cur);
    FETCH v_cur INTO v_row;
    IF v_cur%FOUND THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Catalogos devueltos');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] Catalogo vacio');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 2: LEADS_LIST ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_cnt NUMBER := 0;
BEGIN
    CRM_LEADS_API.LEADS_LIST(v_cur, NULL, NULL);
    FETCH v_cur INTO v_cnt;
    IF v_cnt > 0 THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Leads listados: ' || v_cnt);
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No hay leads');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 3: LEADS_GET (lead 10) ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_id NUMBER;
    v_titulo VARCHAR2(500);
BEGIN
    CRM_LEADS_API.LEADS_GET(v_cur, 10);
    FETCH v_cur INTO v_id, v_titulo;
    IF v_id = 10 THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Lead 10: ' || v_titulo);
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] Lead no encontrado');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 4: LEADS_CREATE (nuevo lead) ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_id NUMBER;
    v_success VARCHAR2(10);
BEGIN
    CRM_LEADS_API.LEADS_CREATE(
        v_cur,
        p_x01 => 'Test lead desde SQL',
        p_x02 => 'Descripcion de prueba',
        p_x03 => 75,
        p_x04 => 1,
        p_x05 => 5,
        p_x06 => 1,
        p_x07 => 'Empresa Test SA',
        p_x08 => 'Juan Perez',
        p_x09 => '+57 300 123 4567',
        p_x10 => 'jperez@test.com'
    );
    FETCH v_cur INTO v_id, v_success;
    IF v_success = 'true' AND v_id > 0 THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Lead creado con ID: ' || v_id);
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No se creo lead');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 5: LEADS_UPDATE (lead 10) ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_success VARCHAR2(10);
BEGIN
    CRM_LEADS_API.LEADS_UPDATE(
        v_cur,
        p_x01 => 10,
        p_x02 => 'Cotización proyecto RCI Seren del Mar - ACTUALIZADO',
        p_x04 => 2
    );
    FETCH v_cur INTO v_success;
    IF v_success = 'true' THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Lead 10 actualizado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No se actualizo');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 6: LEADS_HISTORIAL (lead 10) ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_cnt NUMBER := 0;
BEGIN
    CRM_LEADS_API.LEADS_HISTORIAL(v_cur, 10);
    FOR i IN 1..100 LOOP
        FETCH v_cur INTO v_cnt;
        IF v_cur%NOTFOUND THEN EXIT; END IF;
    END LOOP;
    CLOSE v_cur;
    DBMS_OUTPUT.PUT_LINE('  [OK] Historial lead 10: ' || v_cnt || ' entradas');
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 7: LEADS_AGREGAR_INTERES ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_success VARCHAR2(10);
BEGIN
    CRM_LEADS_API.LEADS_AGREGAR_INTERES(v_cur, 10, 2);
    FETCH v_cur INTO v_success;
    IF v_success = 'true' THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Interes 2 agregado a lead 10');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No se agrego interes');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 8: LEADS_QUITAR_INTERES ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_success VARCHAR2(10);
BEGIN
    CRM_LEADS_API.LEADS_QUITAR_INTERES(v_cur, 10, 2);
    FETCH v_cur INTO v_success;
    IF v_success = 'true' THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Interes 2 removido de lead 10');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No se removio interes');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT --- TEST 9: LEADS_DESCALIFICAR ---
DECLARE
    v_cur SYS_REFCURSOR;
    v_success VARCHAR2(10);
BEGIN
    CRM_LEADS_API.LEADS_DESCALIFICAR(v_cur, 1, 3, 'Test de descalificacion');
    FETCH v_cur INTO v_success;
    IF v_success = 'true' THEN
        DBMS_OUTPUT.PUT_LINE('  [OK] Lead 1 descalificado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  [FAIL] No se descalifico');
    END IF;
    CLOSE v_cur;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || SQLERRM);
END;
/

PROMPT
PROMPT ============================================================
PROMPT Resumen de datos en base:
PROMPT ============================================================
SELECT 'CRM_LEAD' AS tabla, COUNT(*) AS cnt FROM CRM_LEAD
UNION ALL
SELECT 'CRM_LEAD_INTERES', COUNT(*) FROM CRM_LEAD_INTERES
UNION ALL
SELECT 'CRM_HIST_ESTADO_LEAD', COUNT(*) FROM CRM_HIST_ESTADO_LEAD;

PROMPT
PROMPT Estado actual de leads:
SELECT l.id_lead, l.titulo, e.nombre AS estado, l.score
FROM CRM_LEAD l
JOIN CRM_ESTADO_LEAD e ON e.id_estado_lead = l.id_estado_lead
ORDER BY l.id_lead;

SET FEEDBACK ON;
PROMPT Test suite completado.