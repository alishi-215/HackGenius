import requests
from models import Tool
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pre-loaded OWASP/MITRE snippets for RAG Novelty
CYBERSEC_KNOWLEDGE_BASE = [
    # OWASP Top 10 (2021)
    {"title": "OWASP A01: Broken Access Control", "content": "Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and data."},
    {"title": "OWASP A02: Cryptographic Failures", "content": "Failures related to cryptography (or lack thereof). Often leads to sensitive data exposure, such as passwords, health records, or credit card numbers, which may not be properly protected."},
    {"title": "OWASP A03: Injection", "content": "Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. E.g., SQL Injection (SQLi), Cross-Site Scripting (XSS), OS Command Injection."},
    {"title": "OWASP A04: Insecure Design", "content": "Focuses on risks related to design flaws. Emphasizes the need for threat modeling, secure design patterns, and reference architectures."},
    {"title": "OWASP A05: Security Misconfiguration", "content": "Insecure default settings, incomplete configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information."},
    {"title": "OWASP A06: Vulnerable and Outdated Components", "content": "Using components (libraries, frameworks, and other software modules) with known vulnerabilities. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover."},
    {"title": "OWASP A07: Identification and Authentication Failures", "content": "When authentication and session management functions are implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens."},
    {"title": "OWASP A08: Software and Data Integrity Failures", "content": "Relates to code and infrastructure that does not protect against integrity violations. This includes software updates, critical data, and CI/CD pipelines without verifying integrity."},
    {"title": "OWASP A09: Security Logging and Monitoring Failures", "content": "Coupled with missing or ineffective integration with incident response, allows attackers to further extract data, maintain persistence, and pivot to more systems."},
    {"title": "OWASP A10: Server-Side Request Forgery (SSRF)", "content": "Occurs whenever a web application is fetching a remote resource without validating the user-supplied URL."},

    # MITRE ATT&CK Tactics
    {"title": "MITRE ATT&CK: Reconnaissance", "content": "The adversary is trying to gather information they can use to plan future operations (e.g., Active Scanning, Search Open Technical Databases)."},
    {"title": "MITRE ATT&CK: Resource Development", "content": "The adversary is trying to establish resources they can use to support operations (e.g., Acquire Infrastructure, Compromise Accounts)."},
    {"title": "MITRE ATT&CK: Initial Access", "content": "The adversary is trying to get into your network. Techniques use various entry vectors to gain their initial foothold (e.g., Phishing, Exploiting Public-Facing Applications)."},
    {"title": "MITRE ATT&CK: Execution", "content": "The adversary is trying to run malicious code. Techniques that result in adversary-controlled code running on a local or remote system (e.g., Command and Scripting Interpreter, Scheduled Task/Job)."},
    {"title": "MITRE ATT&CK: Persistence", "content": "The adversary is trying to maintain their foothold. Techniques that adversaries use to keep access to systems across restarts, changed credentials, and other interruptions (e.g., Boot or Logon Autostart Execution, Create Account)."},
    {"title": "MITRE ATT&CK: Privilege Escalation", "content": "The adversary is trying to gain higher-level permissions. Techniques that adversaries use to gain higher-level permissions on a system or network (e.g., Abuse Elevation Control Mechanism, Valid Accounts)."},
    {"title": "MITRE ATT&CK: Defense Evasion", "content": "The adversary is trying to avoid being detected. Techniques that adversaries use to avoid detection throughout their compromise (e.g., Obfuscated Files or Information, Impair Defenses)."},
    {"title": "MITRE ATT&CK: Credential Access", "content": "The adversary is trying to steal account names and passwords. Techniques for stealing credentials like account names and passwords (e.g., OS Credential Dumping, Brute Force)."},
    {"title": "MITRE ATT&CK: Discovery", "content": "The adversary is trying to figure out your environment. Techniques an adversary may use to gain knowledge about the system and internal network (e.g., Network Service Discovery, System Information Discovery)."},
    {"title": "MITRE ATT&CK: Lateral Movement", "content": "The adversary is trying to move through your environment. Techniques that adversaries use to enter and control remote systems on a network (e.g., Remote Services, Lateral Tool Transfer)."},
    {"title": "MITRE ATT&CK: Collection", "content": "The adversary is trying to gather data of interest to their goal. Techniques adversaries may use to gather information and the sources information is collected from (e.g., Data from Local System, Email Collection)."},
    {"title": "MITRE ATT&CK: Command and Control", "content": "The adversary is trying to communicate with compromised systems to control them. Techniques that adversaries may use to communicate with systems under their control within a victim network (e.g., Application Layer Protocol, Ingress Tool Transfer)."},
    {"title": "MITRE ATT&CK: Exfiltration", "content": "The adversary is trying to steal data. Techniques that adversaries may use to steal data from your network (e.g., Exfiltration Over Alternative Protocol, Exfiltration Over Web Service)."},
    {"title": "MITRE ATT&CK: Impact", "content": "The adversary is trying to manipulate, interrupt, or destroy your systems and data. Techniques that adversaries use to disrupt availability or compromise integrity by manipulating business and operational processes (e.g., Data Encrypted for Impact, Endpoint Denial of Service)."},

    # General Methodologies
    {"title": "Cyber Kill Chain", "content": "A phased approach to understanding cyber attacks: 1. Reconnaissance, 2. Weaponization, 3. Delivery, 4. Exploitation, 5. Installation, 6. Command and Control (C2), 7. Actions on Objectives."},
    {"title": "Penetration Testing Execution Standard (PTES)", "content": "A standard outlining the phases of a penetration test: 1. Pre-engagement Interactions, 2. Intelligence Gathering, 3. Threat Modeling, 4. Vulnerability Analysis, 5. Exploitation, 6. Post-Exploitation, 7. Reporting."}
]

class Brain:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Brain, cls).__new__(cls)
        return cls._instance

    def _search_cve(self, keyword):
        """Novelty Feature 2: Real-time CVE Search using NVD API"""
        logger.info(f"Searching real-time CVEs for: {keyword}")
        try:
            url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={keyword}&resultsPerPage=3"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                vulnerabilities = data.get('vulnerabilities', [])
                if vulnerabilities:
                    cve_list = []
                    for v in vulnerabilities:
                        cve_data = v.get('cve', {})
                        cve_id = cve_data.get('id', 'Unknown ID')
                        descriptions = cve_data.get('descriptions', [])
                        
                        # Find English description
                        desc = 'No description available'
                        for d in descriptions:
                            if d.get('lang') == 'en':
                                desc = d.get('value')
                                break
                        
                        # Extract CVSS if available
                        metrics = cve_data.get('metrics', {})
                        cvss_score = "N/A"
                        if 'cvssMetricV31' in metrics and len(metrics['cvssMetricV31']) > 0:
                            cvss_score = metrics['cvssMetricV31'][0]['cvssData']['baseScore']
                            
                        cve_list.append(f"**{cve_id}** (CVSS: {cvss_score}): {desc}")
                    
                    return "\n\n".join(cve_list)
        except Exception as e:
            logger.error(f"CVE Fetch Error: {e}")
            pass
        return None

    def get_recommendation(self, user_query, persona="neutral"):
        query_lower = user_query.lower()

        # -------------------------------------------------------------
        # NOVELTY FEATURE 3: Automated Hacking Log Parser
        # -------------------------------------------------------------
        # If the user pastes a raw Nmap scan or large chunk of ports/services
        if any(keyword in query_lower for keyword in ["port", "state", "service", "nmap scan report", "tcp", "udp", "filtered", "open"]) and len(query_lower.split()) > 15:
            # Looks like a raw log. Bypass RAG and CVE, and go straight to Parser.
            logger.info("Detected raw scanner log. switching to Parser Mode...")
            prompt = self._construct_parser_prompt(user_query, persona)
            
            try:
                response = requests.post('http://localhost:11434/api/generate', json={
                    "model": "phi", 
                    "prompt": prompt,
                    "stream": False
                })
                if response.status_code == 200:
                    return response.json().get('response', "I couldn't generate a report.")
            except Exception as e:
                logger.error(f"Failed to connect to Ollama (Parser Mode): {e}")
                return "Parser Mode failed. Is Ollama running?"
        
        # -------------------------------------------------------------
        # NOVELTY FEATURE 2: Real-time CVE Search Interception
        # -------------------------------------------------------------
        # Catch more phrases like "vulnerabilities in apache" or "cves for nginx"
        if any(keyword in query_lower for keyword in ["cve", "vulnerability", "vulnerabilities", "exploit"]):
            # Extract keyword cleanly (just take words likely to be software names)
            skip_words = ["cve", "cves", "for", "latest", "what", "are", "the", "in", "vulnerabilities", "show", "me", "find", "search", "about", "vulnerability", "exploits", "exploit"]
            words = [w for w in query_lower.split() if w not in skip_words and len(w) > 2]
            if words:
                keyword = words[-1] # Try the last meaningful word (e.g. "apache" in "vulnerabilities in apache")
                cve_results = self._search_cve(keyword)
                
                if cve_results:
                    return f"### Real-Time CVE Search Results for '{keyword.capitalize()}'\n\n{cve_results}\n\n*Source: NIST National Vulnerability Database (Real-Time)*"
            
            # If we caught the keyword but failed to find a specific software or the API failed, we fall through to RAG.

        # -------------------------------------------------------------
        # NOVELTY FEATURE 1: Enhanced RAG (Retrieval-Augmented Gen)
        # -------------------------------------------------------------
        context = self._retrieve_context(user_query)
        prompt = self._construct_prompt(user_query, context, persona)
        
        # 3. Generate using Ollama
        logger.info(f"Sending request to Ollama with Persona: {persona}...")
        try:
            # Using 'phi' model by default
            response = requests.post('http://localhost:11434/api/generate', json={
                "model": "phi", 
                "prompt": prompt,
                "stream": False
            })
            
            if response.status_code == 200:
                answer = response.json().get('response', "I couldn't generate a response.")
                # Add Citations footmark to highlight the RAG novelty visually
                if context and "No specific" not in context:
                    answer += "\n\n*(Sourced from: HackGenius RAG Pipeline & Tool Database)*"
                return answer
            else:
                logger.error(f"Ollama Error: {response.text}")
                return "I'm meant to be smart, but I can't reach my brain (Ollama). Please ensure Ollama is running."
                
        except Exception as e:
            logger.error(f"Failed to connect to Ollama: {e}")
            return "I cannot connect to Ollama. Please check if it's running on localhost:11434."

    def _retrieve_context(self, query):
        """
        Retrieval-Augmented Generation (Novelty Feature 1)
        Combines Tool Data with Cybersec Framework Knowledge
        """
        words = query.lower().split()
        relevant_context = []
        
        # 1. Retrieve Tools
        all_tools = Tool.query.all()
        for tool in all_tools:
            tool_text = (tool.name + " " + tool.description).lower()
            if any(w in tool_text for w in words if len(w) > 3): 
                relevant_context.append(
                    f"[TOOL DBN]: {tool.name} - {tool.description}. Usage: {tool.command_usage}."
                )
        
        # 2. Retrieve OWASP/MITRE Knowledge
        for kb in CYBERSEC_KNOWLEDGE_BASE:
            kb_text = (kb["title"] + " " + kb["content"]).lower()
            if any(w in kb_text for w in words if len(w) > 3):
                relevant_context.append(f"[{kb['title']}]: {kb['content']}")
                
        if not relevant_context:
            return "No specific tools or framework guidelines found for this query."
            
        return "\n".join(relevant_context[:5]) # Top 5 closest contexts

    def _construct_prompt(self, query, context_str, persona):
        persona_directive = ""
        if persona == "red":
            persona_directive = """
You are currently operating in **RED TEAM MODE**.
- Focus strictly on offensive security, exploitation paths, penetration testing methodologies, and how an attacker would bypass defenses.
- Do NOT provide defensive mitigations unless specifically asked.
- Your tone should be that of an elite Red Teamer: analytical, direct, and focused on finding vulnerabilities.
"""
        elif persona == "blue":
            persona_directive = """
You are currently operating in **BLUE TEAM MODE**.
- Focus strictly on defensive security, log analysis, firewall configurations, patching, and incident response.
- Do NOT provide exploitation commands unless demonstrating how to reproduce a bug for defense.
- Your tone should be that of an elite Blue Teamer/SOC Analyst: protective, cautious, and focused on securing architecture.
"""
        else:
            persona_directive = "You are a neutral, objective Ethical Hacking Assistant."

        system_prompt = f"""You are Hack Genius, an elite, professional Cybersecurity Assistant.

**CRITICAL RULES:**
1. YOU MUST NOT mention "Retrieved Context", "Context", or "according to the database" in your answer. Speak directly as the expert.
2. Be direct, authentic, and straight to the point. No fluff. No generic advice.
3. If the user asks about a topic and the context doesn't directly answer it, use your own hacking knowledge to give a concise, technical answer.
4. Format your response cleanly using Markdown (use bolding for emphasis and bullet points for lists). 
5. FOLLOW YOUR PERSONA STRICTLY.

--- PERSONA DIRECTIVE ---
{persona_directive}
--- END PERSONA DIRECTIVE ---

--- SYSTEM CONTEXT (DO NOT MENTION THIS TO THE USER) ---
{context_str}
--- END SYSTEM CONTEXT ---

User Query: {query}
Direct, Professional Answer:
"""
        return system_prompt

    def _construct_parser_prompt(self, raw_log, persona):
        """
        Specialized prompt for NOVELTY FEATURE 3 (Log Parsing).
        Forces the AI to act as an automated reporting engine, adjusted by persona.
        """
        focus = "Vulnerability Analysis Report"
        if persona == "blue":
             focus = "Defensive Mitigation Report"
        elif persona == "red":
             focus = "Exploitation Strategy Report"

        system_prompt = f"""You are Hack Genius, an elite Cybersecurity Log Analysis Engine.
The user has provided raw output from a security scanner (like Nmap, Nikto, or Wireshark) or system logs.

**YOUR TASK:**
Parse the raw log data and generate a highly professional, structured "{focus}". 

**MANDATORY FORMAT:**
1. **Executive Summary:** 1-2 sentence overview of what the scan shows.
2. **Key Findings:** (Bullet points detailing open ports, outdated software versions, or specific anomalies).
3. **Primary Directives ({'Offensive' if persona == 'red' else 'Defensive'} Focus):** (What should the {'Red Team do next to exploit this' if persona == 'red' else 'Blue Team do next to secure this'}).

Do NOT say "Here is your report" or "I am an AI". Output ONLY the professional Markdown report.

--- RAW SCANNER LOG ---
{raw_log}
--- END LOG ---

Professional Report:
"""
        return system_prompt
