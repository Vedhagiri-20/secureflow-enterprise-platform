package com.secureflow.service;

import com.secureflow.dto.CreateWorkflowRequest;
import com.secureflow.dto.CreateWorkflowResponse;
import com.secureflow.dto.WorkflowDetailResponse;
import com.secureflow.entity.LoanType;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.repository.LoanTypeRepository;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    @Autowired
    private UserRepository userRepository;

    public CreateWorkflowResponse createWorkflow(CreateWorkflowRequest request) {

        LoanType loanType = loanTypeRepository.findById(request.getLoanTypeId())
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        User employee = userRepository.findByEmail(request.getEmployeeEmail())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        WorkflowRequest workflow = new WorkflowRequest();

        workflow.setLoanType(loanType);
        workflow.setCreatedByUser(employee);
        workflow.setAssignedManager(loanType.getManager());

        workflow.setApplicantName(request.getApplicantName());
        workflow.setApplicantEmail(request.getApplicantEmail());
        workflow.setApplicantPhone(request.getApplicantPhone());
        workflow.setLoanAmount(request.getLoanAmount());
        workflow.setLoanPurpose(request.getLoanPurpose());
        workflow.setEmploymentType(request.getEmploymentType());
        workflow.setGovernmentIdType(request.getGovernmentIdType());
        workflow.setGovernmentIdNumber(request.getGovernmentIdNumber());
        workflow.setResidentialAddress(request.getResidentialAddress());

        workflow.setPriority(
                request.getPriority() != null && !request.getPriority().isEmpty()
                        ? request.getPriority()
                        : loanType.getDefaultPriority()
        );

        workflow.setCurrentStatus("Pending");
        workflow.setSubmittedAt(LocalDateTime.now());
        workflow.setUpdatedAt(LocalDateTime.now());

        WorkflowRequest savedWorkflow = workflowRequestRepository.save(workflow);

        String workItemNumber =
                loanType.getLoanCode() + "-"
                        + String.format("%04d", savedWorkflow.getWorkflowId());

        savedWorkflow.setWorkItemNumber(workItemNumber);

        WorkflowRequest updatedWorkflow = workflowRequestRepository.save(savedWorkflow);

        return new CreateWorkflowResponse(
                "Workflow Created Successfully",
                updatedWorkflow.getWorkItemNumber()
        );
    }

    public WorkflowDetailResponse searchWorkflow(String email, String query, String loanType) {

        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<WorkflowRequest> workflows =
                workflowRequestRepository.findByCreatedByUserOrderBySubmittedAtDesc(employee);

        String searchText = query == null ? "" : query.trim().toLowerCase();
        String selectedLoan = loanType == null ? "" : loanType.trim().toLowerCase();

        WorkflowRequest workflow = workflows.stream()
                .filter(w -> {
                    boolean loanMatch =
                            selectedLoan.isEmpty()
                                    || w.getLoanType().getLoanName().toLowerCase().equals(selectedLoan);

                    boolean queryMatch =
                            searchText.isEmpty()
                                    || String.valueOf(w.getWorkflowId()).equals(searchText)
                                    || w.getWorkItemNumber().toLowerCase().contains(searchText)
                                    || w.getApplicantName().toLowerCase().contains(searchText)
                                    || w.getLoanType().getLoanName().toLowerCase().contains(searchText);

                    return loanMatch && queryMatch;
                })
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        return new WorkflowDetailResponse(
                workflow.getWorkItemNumber(),
                workflow.getLoanType().getLoanName(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getApplicantPhone(),
                workflow.getLoanAmount(),
                workflow.getLoanPurpose(),
                workflow.getCurrentStatus(),
                workflow.getPriority(),
                workflow.getAssignedManager() != null
                        ? workflow.getAssignedManager().getFullName()
                        : "Not Assigned",
                workflow.getSubmittedAt()
        );
    }
}