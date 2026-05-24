import os
import re

# Base directory paths
BASE_DIR = r"c:\Users\violet\Documents\MQF\Study Materials\Sixth Semester\QLDA\vibepowerapps"
SRC_DIR = os.path.join(BASE_DIR, "src")
ENTITIES_DIR = os.path.join(SRC_DIR, "Entities")
RELATIONSHIPS_DIR = os.path.join(SRC_DIR, "Other", "Relationships")
RELATIONSHIPS_FILE = os.path.join(SRC_DIR, "Other", "Relationships.xml")

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(content)
    print(f"✅ Updated file: {path}")

def modify_project_cascade():
    path = os.path.join(RELATIONSHIPS_DIR, "cr5db_Project.xml")
    if not os.path.exists(path):
        print(f"❌ Project relationships file not found: {path}")
        return
    
    content = read_file(path)
    
    # Locate the cr5db_projectobjectivealignment_Project_cr5db_project relationship block
    # and update its cascades to Parental (Cascade)
    pattern = r'(<EntityRelationship Name="cr5db_projectobjectivealignment_Project_cr5db_project">.*?</EntityRelationship>)'
    
    def repl(match):
        block = match.group(1)
        block = re.sub(r'<CascadeAssign>.*?</CascadeAssign>', '<CascadeAssign>Cascade</CascadeAssign>', block)
        block = re.sub(r'<CascadeDelete>.*?</CascadeDelete>', '<CascadeDelete>Cascade</CascadeDelete>', block)
        block = re.sub(r'<CascadeArchive>.*?</CascadeArchive>', '<CascadeArchive>Cascade</CascadeArchive>', block)
        block = re.sub(r'<CascadeReparent>.*?</CascadeReparent>', '<CascadeReparent>Cascade</CascadeReparent>', block)
        block = re.sub(r'<CascadeShare>.*?</CascadeShare>', '<CascadeShare>Cascade</CascadeShare>', block)
        block = re.sub(r'<CascadeUnshare>.*?</CascadeUnshare>', '<CascadeUnshare>Cascade</CascadeUnshare>', block)
        return block

    new_content, count = re.subn(pattern, repl, content, flags=re.DOTALL)
    if count > 0:
        write_file(path, new_content)
        print("✅ Modified Project-Objective Alignment relationship to Parental Cascade Delete.")
    else:
        print("❌ Could not find Project-Objective Alignment relationship to modify.")

def add_lookup_attribute(entity_name, attribute_name, display_name, description=""):
    path = os.path.join(ENTITIES_DIR, entity_name, "Entity.xml")
    if not os.path.exists(path):
        print(f"❌ Entity file not found: {path}")
        return
    
    content = read_file(path)
    
    # Check if attribute already exists
    if f'PhysicalName="{attribute_name}"' in content:
        print(f"ℹ️ Attribute {attribute_name} already exists in {entity_name}.")
        return

    # Attribute XML template
    attribute_xml = f"""        <attribute PhysicalName="{attribute_name}">
          <Type>lookup</Type>
          <Name>{attribute_name.lower()}</Name>
          <LogicalName>{attribute_name.lower()}</LogicalName>
          <RequiredLevel>none</RequiredLevel>
          <DisplayMask>ValidForAdvancedFind|ValidForForm|ValidForGrid</DisplayMask>
          <ImeMode>auto</ImeMode>
          <ValidForUpdateApi>1</ValidForUpdateApi>
          <ValidForReadApi>1</ValidForReadApi>
          <ValidForCreateApi>1</ValidForCreateApi>
          <IsCustomField>1</IsCustomField>
          <IsAuditEnabled>1</IsAuditEnabled>
          <IsSecured>0</IsSecured>
          <IntroducedVersion>1.0</IntroducedVersion>
          <IsCustomizable>1</IsCustomizable>
          <IsRenameable>1</IsRenameable>
          <CanModifySearchSettings>1</CanModifySearchSettings>
          <CanModifyRequirementLevelSettings>1</CanModifyRequirementLevelSettings>
          <CanModifyAdditionalSettings>1</CanModifyAdditionalSettings>
          <SourceType>0</SourceType>
          <IsGlobalFilterEnabled>0</IsGlobalFilterEnabled>
          <IsSortableEnabled>0</IsSortableEnabled>
          <CanModifyGlobalFilterSettings>1</CanModifyGlobalFilterSettings>
          <CanModifyIsSortableSettings>1</CanModifyIsSortableSettings>
          <IsDataSourceSecret>0</IsDataSourceSecret>
          <AutoNumberFormat></AutoNumberFormat>
          <IsSearchable>1</IsSearchable>
          <IsFilterable>1</IsFilterable>
          <IsRetrievable>1</IsRetrievable>
          <IsLocalizable>0</IsLocalizable>
          <LookupStyle>single</LookupStyle>
          <LookupTypes />
          <displaynames>
            <displayname description="{display_name}" languagecode="1033" />
          </displaynames>
          <Descriptions>
            <Description description="{description}" languagecode="1033" />
          </Descriptions>
        </attribute>
"""
    # Insert before the closing </attributes> tag
    new_content = content.replace("      </attributes>", attribute_xml + "      </attributes>")
    write_file(path, new_content)
    print(f"✅ Added lookup attribute '{attribute_name}' to '{entity_name}'.")

def make_relationship_xml(name, child_entity, parent_entity, child_lookup, description=""):
    return f"""  <EntityRelationship Name="{name}">
    <EntityRelationshipType>OneToMany</EntityRelationshipType>
    <IsCustomizable>1</IsCustomizable>
    <IntroducedVersion>1.0</IntroducedVersion>
    <IsHierarchical>0</IsHierarchical>
    <ReferencingEntityName>{child_entity}</ReferencingEntityName>
    <ReferencedEntityName>{parent_entity}</ReferencedEntityName>
    <CascadeAssign>NoCascade</CascadeAssign>
    <CascadeDelete>RemoveLink</CascadeDelete>
    <CascadeArchive>RemoveLink</CascadeArchive>
    <CascadeReparent>NoCascade</CascadeReparent>
    <CascadeShare>NoCascade</CascadeShare>
    <CascadeUnshare>NoCascade</CascadeUnshare>
    <CascadeRollupView>NoCascade</CascadeRollupView>
    <IsValidForAdvancedFind>1</IsValidForAdvancedFind>
    <ReferencingAttributeName>{child_lookup}</ReferencingAttributeName>
    <RelationshipDescription>
      <Descriptions>
        <Description description="{description}" languagecode="1033" />
      </Descriptions>
    </RelationshipDescription>
    <EntityRelationshipRoles>
      <EntityRelationshipRole>
        <NavPaneDisplayOption>UseCollectionName</NavPaneDisplayOption>
        <NavPaneArea>Details</NavPaneArea>
        <NavPaneOrder>10000</NavPaneOrder>
        <NavigationPropertyName>{child_lookup}</NavigationPropertyName>
        <RelationshipRoleType>1</RelationshipRoleType>
      </EntityRelationshipRole>
      <EntityRelationshipRole>
        <NavigationPropertyName>{name}</NavigationPropertyName>
        <RelationshipRoleType>0</RelationshipRoleType>
      </EntityRelationshipRole>
    </EntityRelationshipRoles>
  </EntityRelationship>
"""

def append_relationships_to_file(parent_filename, new_relationships_list):
    path = os.path.join(RELATIONSHIPS_DIR, parent_filename)
    
    if os.path.exists(path):
        content = read_file(path)
        
        # Check and add only the relationships that don't already exist in the file
        inserted_xml = ""
        for rel in new_relationships_list:
            if f'Name="{rel["name"]}"' not in content:
                inserted_xml += make_relationship_xml(
                    rel["name"], rel["child"], rel["parent"], rel["lookup"], rel["desc"]
                )
        
        if inserted_xml:
            new_content = content.replace("</EntityRelationships>", inserted_xml + "</EntityRelationships>")
            write_file(path, new_content)
            print(f"✅ Appended relationships to existing file: {parent_filename}")
        else:
            print(f"ℹ️ Relationships already exist in {parent_filename}.")
    else:
        # Create new relationship file
        xml_content = '<?xml version="1.0" encoding="utf-8"?>\n<EntityRelationships xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n'
        for rel in new_relationships_list:
            xml_content += make_relationship_xml(
                rel["name"], rel["child"], rel["parent"], rel["lookup"], rel["desc"]
            )
        xml_content += "</EntityRelationships>\n"
        write_file(path, xml_content)
        print(f"✅ Created new relationship file: {parent_filename}")

def register_relationships_in_master_manifest(relationship_names):
    if not os.path.exists(RELATIONSHIPS_FILE):
        print(f"❌ Master relationships file not found: {RELATIONSHIPS_FILE}")
        return
        
    content = read_file(RELATIONSHIPS_FILE)
    
    inserted_tags = ""
    for name in relationship_names:
        tag = f'  <EntityRelationship Name="{name}" />\n'
        if f'Name="{name}"' not in content:
            inserted_tags += tag
            
    if inserted_tags:
        # Insert before the closing </EntityRelationships> tag
        new_content = content.replace("</EntityRelationships>", inserted_tags + "</EntityRelationships>")
        write_file(RELATIONSHIPS_FILE, new_content)
        print("✅ Registered relationships in master Relationships.xml.")
    else:
        print("ℹ️ Relationships already registered in master Relationships.xml.")

def main():
    print("🚀 Starting local schema configuration updates...")
    
    # 1. Modify Cascades
    modify_project_cascade()
    
    # 2. Add columns to Task
    add_lookup_attribute("cr5db_Task", "cr5db_AssigneeID", "Assignee", "Task assignee custom user lookup")
    add_lookup_attribute("cr5db_Task", "cr5db_ProjectPhaseID", "Project Phase", "Lookup to Project Phase (3NF task mapping)")
    
    # 3. Add columns to Timesheet Log
    add_lookup_attribute("cr5db_TimesheetLog", "cr5db_UserID", "Logged By", "Lookup to User who logged the hours")
    
    # 4. Add columns to Performance Appraisal
    add_lookup_attribute("cr5db_PerformanceAppraisal", "cr5db_EmployeeID", "Employee", "Employee being appraised")
    add_lookup_attribute("cr5db_PerformanceAppraisal", "cr5db_PeriodID", "Evaluation Period", "Appraisal evaluation period")
    add_lookup_attribute("cr5db_PerformanceAppraisal", "cr5db_EvaluatorID", "Evaluator", "Manager/Evaluator performing the appraisal")
    
    # 5. Add columns to KPI Target
    add_lookup_attribute("cr5db_KPITarget", "cr5db_EmployeeID", "Employee Target Owner", "Employee target owner")
    
    # 6. Prepare Relationships Lists
    user_relationships = [
        {
            "name": "cr5db_Task_Assignee_cr5db_User",
            "child": "cr5db_Task",
            "parent": "cr5db_User",
            "lookup": "cr5db_AssigneeID",
            "desc": "Task Assignee custom lookup"
        },
        {
            "name": "cr5db_TimesheetLog_User_cr5db_User",
            "child": "cr5db_TimesheetLog",
            "parent": "cr5db_User",
            "lookup": "cr5db_UserID",
            "desc": "Timesheet logged by user"
        },
        {
            "name": "cr5db_PerformanceAppraisal_Employee_cr5db_User",
            "child": "cr5db_PerformanceAppraisal",
            "parent": "cr5db_User",
            "lookup": "cr5db_EmployeeID",
            "desc": "Appraisal employee"
        },
        {
            "name": "cr5db_PerformanceAppraisal_Evaluator_cr5db_User",
            "child": "cr5db_PerformanceAppraisal",
            "parent": "cr5db_User",
            "lookup": "cr5db_EvaluatorID",
            "desc": "Appraisal evaluator manager"
        },
        {
            "name": "cr5db_KPITarget_Employee_cr5db_User",
            "child": "cr5db_KPITarget",
            "parent": "cr5db_User",
            "lookup": "cr5db_EmployeeID",
            "desc": "KPI target employee owner"
        }
    ]
    
    period_relationships = [
        {
            "name": "cr5db_PerformanceAppraisal_Period_cr5db_EvaluationPeriod",
            "child": "cr5db_PerformanceAppraisal",
            "parent": "cr5db_EvaluationPeriod",
            "lookup": "cr5db_PeriodID",
            "desc": "Appraisal period"
        }
    ]
    
    phase_relationships = [
        {
            "name": "cr5db_Task_ProjectPhase_cr5db_ProjectPhase",
            "child": "cr5db_Task",
            "parent": "cr5db_ProjectPhase",
            "lookup": "cr5db_ProjectPhaseID",
            "desc": "Task phase lookup"
        }
    ]
    
    # 7. Append/Create Relationship files
    append_relationships_to_file("cr5db_User.xml", user_relationships)
    append_relationships_to_file("cr5db_EvaluationPeriod.xml", period_relationships)
    append_relationships_to_file("cr5db_ProjectPhase.xml", phase_relationships)
    
    # 8. Register relationships in master Relationships.xml
    all_rel_names = [r["name"] for r in user_relationships + period_relationships + phase_relationships]
    register_relationships_in_master_manifest(all_rel_names)
    
    print("\n🎉 Local Schema Modifications complete!")

if __name__ == "__main__":
    main()
