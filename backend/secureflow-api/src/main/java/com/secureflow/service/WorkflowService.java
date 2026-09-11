package com.secureflow.service;

import com.secureflow.dto.ApplicationDetailResponse;
import com.secureflow.dto.ApplicationSummaryResponse;
import com.secureflow.dto.CreateApplicationRequest;
import com.secureflow.dto.CreateWorkflowRequest;
import com.secureflow.dto.CreateWorkflowResponse;
import com.secureflow.dto.CustomerDashboardResponse;
import com.secureflow.dto.EmployeeApplicationResponse;
import com.secureflow.dto.WorkflowDetailResponse;
import com.secureflow.entity.LoanType;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.LoanTypeRepository;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    @Autowired
    private UserRepository userRepository;

    public ApplicationDetailResponse createApplication(
            CreateApplicationRequest request
    ) {
        User customer = getCustomer(request.getCustomerEmail());

        LoanType loanType = loanTypeRepository
                .findById(request.getLoanTypeId())
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        WorkflowRequest workflow = new WorkflowRequest();

        workflow.setLoanType(loanType);
        workflow.setCreatedByUser(customer);
        workflow.setAssignedEmployee(null);
        workflow.setAssignedManager(loanType.getManager());
        workflow.setApplicantName(request.getApplicantName());
        workflow.setApplicantEmail(customer.getEmail());
        workflow.setApplicantPhone(request.getApplicantPhone());
        workflow.setLoanAmount(request.getLoanAmount());
        workflow.setLoanPurpose(request.getLoanPurpose());
        workflow.setEmploymentType(request.getEmploymentType());
        workflow.setGovernmentIdType(request.getGovernmentIdType());
        workflow.setGovernmentIdNumber(request.getGovernmentIdNumber());
        workflow.setResidentialAddress(request.getResidentialAddress());
        workflow.setPriority(loanType.getDefaultPriority());
        workflow.setCurrentStatus(WorkflowStatus.SUBMITTED);

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        saved.setWorkItemNumber(
                loanType.getLoanCode()
                        + "-"
                        + String.format("%04d", saved.getWorkflowId())
        );

        saved = workflowRequestRepository.save(saved);

        return toApplicationDetail(saved);
    }

    public List<ApplicationSummaryResponse> getCustomerApplications(
            String email
    ) {
        User customer = getCustomer(email);

        return workflowRequestRepository
                .findByCreatedByUserOrderBySubmittedAtDesc(customer)
                .stream()
                .map(this::toApplicationSummary)
                .toList();
    }

    public ApplicationDetailResponse getCustomerApplication(
            Long workflowId,
            String email
    ) {
        User customer = getCustomer(email);

        WorkflowRequest workflow = workflowRequestRepository
                .findByWorkflowIdAndCreatedByUser(workflowId, customer)
                .orElseThrow(
                        () -> new RuntimeException("Application not found")
                );

        return toApplicationDetail(workflow);
    }

    public CustomerDashboardResponse getCustomerDashboard(String email) {
        User customer = getCustomer(email);

        long total =
                workflowRequestRepository.countByCreatedByUser(customer);

        long submitted =
                workflowRequestRepository
                        .countByCreatedByUserAndCurrentStatus(
                                customer,
                                WorkflowStatus.SUBMITTED.name()
                        );

        long underReview =
                workflowRequestRepository
                        .countByCreatedByUserAndCurrentStatus(
                                customer,
                                WorkflowStatus.UNDER_REVIEW.name()
                        );

        long forwarded =
                workflowRequestRepository
                        .countByCreatedByUserAndCurrentStatus(
                                customer,
                                WorkflowStatus.FORWARDED_TO_MANAGER.name()
                        );

        long approved =
                workflowRequestRepository
                        .countByCreatedByUserAndCurrentStatus(
                                customer,
                                WorkflowStatus.APPROVED.name()
                        );

        long rejected =
                workflowRequestRepository
                        .countByCreatedByUserAndCurrentStatus(
                                customer,
                                WorkflowStatus.REJECTED.name()
                        );

        return new CustomerDashboardResponse(
                total,
                submitted,
                underReview,
                forwarded,
                approved,
                rejected
        );
    }

    public List<EmployeeApplicationResponse> getAvailableApplications(
            String email
    ) {
        getEmployee(email);

        return workflowRequestRepository
                .findByCurrentStatusAndAssignedEmployeeIsNullOrderBySubmittedAtAsc(
                        WorkflowStatus.SUBMITTED.name()
                )
                .stream()
                .map(this::toEmployeeApplication)
                .toList();
    }

    public List<EmployeeApplicationResponse> getEmployeeApplications(
            String email
    ) {
        User employee = getEmployee(email);

        return workflowRequestRepository
                .findByAssignedEmployeeOrderByUpdatedAtDesc(employee)
                .stream()
                .map(this::toEmployeeApplication)
                .toList();
    }

    public EmployeeApplicationResponse startReview(
            Long workflowId,
            String email
    ) {
        User employee = getEmployee(email);

        WorkflowRequest workflow = workflowRequestRepository
                .findById(workflowId)
                .orElseThrow(
                        () -> new RuntimeException("Application not found")
                );

        if (!WorkflowStatus.SUBMITTED.name()
                .equals(workflow.getCurrentStatus())) {
            throw new RuntimeException(
                    "Application is not available for review"
            );
        }

        if (workflow.getAssignedEmployee() != null) {
            throw new RuntimeException(
                    "Application is already assigned"
            );
        }

        workflow.setAssignedEmployee(employee);
        workflow.setCurrentStatus(WorkflowStatus.UNDER_REVIEW);

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        return toEmployeeApplication(saved);
    }

    public EmployeeApplicationResponse forwardToManager(
            Long workflowId,
            String email
    ) {
        User employee = getEmployee(email);

        WorkflowRequest workflow = workflowRequestRepository
                .findByWorkflowIdAndAssignedEmployee(
                        workflowId,
                        employee
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Application not assigned to this employee"
                        )
                );

        if (!WorkflowStatus.UNDER_REVIEW.name()
                .equals(workflow.getCurrentStatus())) {
            throw new RuntimeException(
                    "Only applications under review can be forwarded"
            );
        }

        if (workflow.getAssignedManager() == null) {
            throw new RuntimeException(
                    "No manager assigned to this loan type"
            );
        }

        workflow.setCurrentStatus(
                WorkflowStatus.FORWARDED_TO_MANAGER
        );

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        return toEmployeeApplication(saved);
    }

    public EmployeeApplicationResponse rejectApplication(
            Long workflowId,
            String email
    ) {
        User employee = getEmployee(email);

        WorkflowRequest workflow = workflowRequestRepository
                .findByWorkflowIdAndAssignedEmployee(
                        workflowId,
                        employee
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Application not assigned to this employee"
                        )
                );

        if (!WorkflowStatus.UNDER_REVIEW.name()
                .equals(workflow.getCurrentStatus())) {
            throw new RuntimeException(
                    "Only applications under review can be rejected"
            );
        }

        workflow.setCurrentStatus(WorkflowStatus.REJECTED);

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        return toEmployeeApplication(saved);
    }

    private User getCustomer(String email) {
        return getUserByRole(email, "CUSTOMER");
    }

    private User getEmployee(String email) {
        return getUserByRole(email, "EMPLOYEE");
    }

    private User getUserByRole(String email, String roleName) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (user.getRole() == null
                || !roleName.equalsIgnoreCase(
                        user.getRole().getRoleName()
                )) {
            throw new RuntimeException(
                    "User does not have the required role"
            );
        }

        return user;
    }

    private ApplicationSummaryResponse toApplicationSummary(
            WorkflowRequest workflow
    ) {
        return new ApplicationSummaryResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getLoanType().getLoanName(),
                workflow.getLoanAmount(),
                workflow.getCurrentStatus(),
                workflow.getSubmittedAt()
        );
    }

    private ApplicationDetailResponse toApplicationDetail(
            WorkflowRequest workflow
    ) {
        String employeeName = workflow.getAssignedEmployee() == null
                ? "Not Assigned"
                : workflow.getAssignedEmployee().getFullName();

        String managerName = workflow.getAssignedManager() == null
                ? "Not Assigned"
                : workflow.getAssignedManager().getFullName();

        return new ApplicationDetailResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getLoanType().getLoanName(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getApplicantPhone(),
                workflow.getLoanAmount(),
                workflow.getLoanPurpose(),
                workflow.getEmploymentType(),
                workflow.getGovernmentIdType(),
                workflow.getGovernmentIdNumber(),
                workflow.getResidentialAddress(),
                workflow.getPriority(),
                workflow.getCurrentStatus(),
                employeeName,
                managerName,
                workflow.getSubmittedAt(),
                workflow.getUpdatedAt()
        );
    }

    private EmployeeApplicationResponse toEmployeeApplication(
            WorkflowRequest workflow
    ) {
        return new EmployeeApplicationResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getLoanType().getLoanName(),
                workflow.getLoanAmount(),
                workflow.getPriority(),
                workflow.getCurrentStatus(),
                workflow.getSubmittedAt()
        );
    }

    public CreateWorkflowResponse createWorkflow(
            CreateWorkflowRequest request
    ) {
        LoanType loanType = loanTypeRepository
                .findById(request.getLoanTypeId())
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        User employee = userRepository
                .findByEmail(request.getEmployeeEmail())
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

        if (request.getPriority() != null
                && !request.getPriority().isBlank()) {
            workflow.setPriority(request.getPriority());
        } else {
            workflow.setPriority(loanType.getDefaultPriority());
        }

        workflow.setCurrentStatus("Pending");
        workflow.setSubmittedAt(LocalDateTime.now());
        workflow.setUpdatedAt(LocalDateTime.now());

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        saved.setWorkItemNumber(
                loanType.getLoanCode()
                        + "-"
                        + String.format("%04d", saved.getWorkflowId())
        );

        saved = workflowRequestRepository.save(saved);

        return new CreateWorkflowResponse(
                "Workflow Created Successfully",
                saved.getWorkItemNumber()
        );
    }

    public WorkflowDetailResponse searchWorkflow(
            String email,
            String query,
            String loanType
    ) {
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<WorkflowRequest> workflows =
                workflowRequestRepository
                        .findByCreatedByUserOrderBySubmittedAtDesc(employee);

        String searchText =
                query == null ? "" : query.trim().toLowerCase();

        String selectedLoan =
                loanType == null ? "" : loanType.trim().toLowerCase();

        WorkflowRequest workflow = workflows.stream()
                .filter(item -> {
                    boolean loanMatches =
                            selectedLoan.isEmpty()
                                    || item.getLoanType()
                                    .getLoanName()
                                    .toLowerCase()
                                    .equals(selectedLoan);

                    boolean queryMatches =
                            searchText.isEmpty()
                                    || String.valueOf(
                                            item.getWorkflowId()
                                    ).equals(searchText)
                                    || item.getWorkItemNumber()
                                    .toLowerCase()
                                    .contains(searchText)
                                    || item.getApplicantName()
                                    .toLowerCase()
                                    .contains(searchText)
                                    || item.getLoanType()
                                    .getLoanName()
                                    .toLowerCase()
                                    .contains(searchText);

                    return loanMatches && queryMatches;
                })
                .findFirst()
                .orElseThrow(
                        () -> new RuntimeException("Workflow not found")
                );

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
